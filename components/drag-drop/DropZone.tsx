'use client';

/**
 * @file DropZone — Generic droppable zone component.
 *
 * A visually-rich drop target for @dnd-kit drag-and-drop interactions.
 * Shows contextual states (default, drag-over, at-capacity) with smooth
 * animations and glassmorphism styling.
 *
 * @example
 * ```tsx
 * <DropZone id="my-stack" label="My Stack" capacity={5} currentCount={2}>
 *   {selectedItems.map(item => <TechCard key={item.id} ... />)}
 * </DropZone>
 * ```
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────────────────

export interface DropZoneProps {
  /** Unique identifier used by @dnd-kit to register this droppable */
  id: string;
  /** Content rendered inside the zone (typically draggable children) */
  children: React.ReactNode;
  /** Optional label displayed at the top of the zone */
  label?: string;
  /** Max number of items this zone can hold */
  capacity?: number;
  /** Current number of items in the zone */
  currentCount?: number;
  /** Extra class applied when a draggable is hovering over this zone */
  acceptClassName?: string;
  /** Additional CSS classes merged onto the outer wrapper */
  className?: string;
  /** If true, the default absolute empty state overlay will not be rendered */
  hideDefaultEmpty?: boolean;
  /** Optional custom text displayed in the default empty overlay instead of "+ Add Component" */
  emptyLabel?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * A generic droppable zone that integrates with @dnd-kit's `DndContext`.
 *
 * Visual states:
 * - **Default** — dashed border, subtle glass background
 * - **Drag-over** — solid border, neon glow, background highlight
 * - **At capacity** — muted border, "full" indicator
 *
 * Includes an optional capacity indicator rendered as text + progress bar.
 */
export function DropZone({
  id,
  children,
  label,
  capacity,
  currentCount = 0,
  acceptClassName,
  className,
  hideDefaultEmpty = false,
  emptyLabel,
}: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isFull = capacity !== undefined && currentCount >= capacity;
  const capacityPercentage =
    capacity !== undefined ? Math.min((currentCount / capacity) * 100, 100) : 0;
  const isOccupied = currentCount > 0;

  return (
    <motion.div
      ref={setNodeRef}
      layout
      className={cn(
        // Base styling — always visible as a drop target
        'relative rounded-lg transition-all duration-300 ease-out',
        // When occupied: remove placeholder borders and backgrounds, let the card shine
        isOccupied
          ? 'p-0 min-h-0 border-none bg-transparent shadow-none'
          : [
              'min-h-[56px] p-3 border border-dashed border-neutral-200 bg-neutral-50/20',
              // Drag-over: solid border + highlight
              isOver && !isFull && [
                'border-solid border-neutral-900 bg-neutral-100/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)]',
                acceptClassName,
              ],
              // At capacity
              isFull && 'border-solid border-neutral-250 bg-neutral-50/80 opacity-90',
            ],
        className,
      )}
    >
      {/* ── Header: Label + Capacity ─────────────────────────────────────── */}
      {(label || capacity !== undefined) && (
        <div className="mb-2 flex items-center justify-between gap-3 select-none">
          {label && (
            <h3
              className={cn(
                'text-[9px] font-mono font-bold uppercase tracking-wider',
                isOver ? 'text-neutral-900' : 'text-neutral-450',
                'transition-colors duration-200',
              )}
            >
              {label}
            </h3>
          )}

          {capacity !== undefined && capacity > 1 && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[8px] font-mono tabular-nums text-neutral-400',
                )}
              >
                {currentCount}/{capacity} slots
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Capacity Progress Bar ────────────────────────────────────────── */}
      {capacity !== undefined && capacity > 1 && (
        <div className="mb-2.5 h-0.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-neutral-800"
            initial={false}
            animate={{ width: `${capacityPercentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      )}

      {/* ── Drop zone content ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOccupied && !isOver && !hideDefaultEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
              {emptyLabel || '+ Add Component'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drag-over pulse ring ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOver && !isFull && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-neutral-900/10 bg-neutral-900/[0.01]"
          />
        )}
      </AnimatePresence>

      {/* ── Full overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOver && isFull && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-[0.5px]"
          >
            <span className="text-[9px] font-mono uppercase font-bold text-neutral-700">
              Full
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DropZone;
