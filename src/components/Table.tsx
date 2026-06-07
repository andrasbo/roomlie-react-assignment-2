import { useState } from "react";
import { useTable } from "../hooks/useTable";
import { type TableData } from "../contexts/TableContext";
import {
  tableDimensions,
  tableSpaceRequirements,
  roomBorderThickness,
} from "../utils/Constants";
import { useAuth } from "../hooks/useAuth";

interface BoundingBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const getBoundingBox = (
  x: number,
  y: number,
  w: number,
  h: number,
  buffer = 0,
): BoundingBox => ({
  left: x - buffer,
  right: x + w + buffer,
  top: y - buffer,
  bottom: y + h + buffer,
});

const isOverlapping = (box1: BoundingBox, box2: BoundingBox) => {
  return (
    box1.left < box2.right &&
    box1.right > box2.left &&
    box1.top < box2.bottom &&
    box1.bottom > box2.top
  );
};

const categoryStyles = {
  competition: "border-4",
  normal: "border-2",
  kids: "border-2 border-dotted bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:8px_8px]",
};

interface TableItemProps {
  table: TableData;
}

export const Table = ({ table }: TableItemProps) => {
  const {
    tables,
    selectedId,
    setSelectedId,
    updateTablePosition,
    roomDimensions,
  } = useTable();
  const { synchTablePosition } = useTable();

  const role = useAuth().role;

  const [position, setPosition] = useState(table.position);

  const [prevPropPosition, setPrevPropPosition] = useState(table.position);
  if (
    table.position.x !== prevPropPosition.x ||
    table.position.y !== prevPropPosition.y
  ) {
    setPrevPropPosition(table.position);
    setPosition(table.position);
  }

  const { width, height } = tableDimensions[table.type];
  const buffer = tableSpaceRequirements[table.type];

  const roomInnerWidth = roomDimensions.width - roomBorderThickness * 2;
  const roomInnerHeight = roomDimensions.height - roomBorderThickness * 2;

  const checkPhysicalCollision = (targetX: number, targetY: number) => {
    const myBox = getBoundingBox(targetX, targetY, width, height, 0); // 0 buffer = fizikai asztal

    return tables.some((other) => {
      if (other.id === table.id) return false;
      const otherDims = tableDimensions[other.type];
      const otherBox = getBoundingBox(
        other.position.x,
        other.position.y,
        otherDims.width,
        otherDims.height,
        0,
      );
      return isOverlapping(myBox, otherBox);
    });
  };

  const checkClearanceViolation = (currentX: number, currentY: number) => {
    const myBox = getBoundingBox(currentX, currentY, width, height, buffer);

    if (
      myBox.left < 0 ||
      myBox.top < 0 ||
      myBox.right > roomInnerWidth ||
      myBox.bottom > roomInnerHeight
    ) {
      return true;
    }

    return tables.some((other) => {
      if (other.id === table.id) return false;
      const otherDims = tableDimensions[other.type];
      const otherBuffer = tableSpaceRequirements[other.type];
      const otherBox = getBoundingBox(
        other.position.x,
        other.position.y,
        otherDims.width,
        otherDims.height,
        otherBuffer,
      );
      return isOverlapping(myBox, otherBox);
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (role === "user") {
      setSelectedId((prev) => (prev === table.id ? null : table.id));
      return;
    }
    if (role !== "admin") {
      return;
    }

    let hasMoved = false;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    let currentX = position.x;
    let currentY = position.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      hasMoved = true;
      if (table.isLocked) return;

      const dx = moveEvent.clientX - startMouseX;
      const dy = moveEvent.clientY - startMouseY;

      const wantedX = Math.max(
        0,
        Math.min(position.x + dx, roomInnerWidth - width),
      );
      const wantedY = Math.max(
        0,
        Math.min(position.y + dy, roomInnerHeight - height),
      );

      let nextX = currentX;
      let nextY = currentY;

      if (!checkPhysicalCollision(wantedX, currentY)) nextX = wantedX;
      if (!checkPhysicalCollision(nextX, wantedY)) nextY = wantedY;

      currentX = nextX;
      currentY = nextY;
      setPosition({ x: currentX, y: currentY });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (hasMoved && !table.isLocked) {
        updateTablePosition(table.id, currentX, currentY);
        synchTablePosition(table.id, currentX, currentY);
      } else if (!hasMoved) {
        setSelectedId((prev) => (prev === table.id ? null : table.id));
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const isClearanceViolated = checkClearanceViolation(position.x, position.y);
  const fadeLevel = 0.2 + (table.status / 10) * 0.8;
  const isSelected = table.id === selectedId;

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`absolute ${role === "guest" ? "cursor-default" : "cursor-pointer"} rounded-lg transition-shadow ${
        isSelected ? "z-20" : "hover:z-10 z-0"
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className={`absolute rounded-xl border-2 transition-colors duration-200 pointer-events-none -z-10 ${
          isClearanceViolated
            ? "bg-red-500/20 border-red-500/60"
            : "bg-black/5 border-dashed border-gray-400/30"
        }`}
        style={{
          width: `${width + buffer * 2}px`,
          height: `${height + buffer * 2}px`,
          left: `-${buffer}px`,
          top: `-${buffer}px`,
        }}
      />

      <div
        className={`w-full h-full flex items-center justify-center rounded-lg text-xs font-bold shadow-md ${
          categoryStyles[table.category]
        } ${isSelected ? "ring-4 ring-blue-500 ring-offset-2" : role === "guest" ? "hover:ring-0" : "hover:ring-2 ring-gray-400"}`}
        style={{
          backgroundColor: table.color,
          opacity: fadeLevel,
        }}
      >
        <span className="bg-white/80 px-2 py-1 rounded select-none pointer-events-none">
          {table.name} {table.isLocked && "🔒"}
        </span>
      </div>
    </div>
  );
};
