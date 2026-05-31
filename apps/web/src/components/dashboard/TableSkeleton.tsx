'use client';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export type SkeletonColumnType = 'avatar+text' | 'text' | 'badge' | 'stat' | 'actions' | 'chip' | 'multiline';

export interface SkeletonColumn {
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  type?: SkeletonColumnType;
  actionCount?: number;
}

function CellContent({ col }: { col: SkeletonColumn }) {
  switch (col.type) {
    case 'avatar+text':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box>
            <Skeleton variant="text" width={col.width ?? 120} height={20} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      );
    case 'badge':
    case 'chip':
      return <Skeleton variant="rounded" width={col.width ?? 80} height={24} sx={{ borderRadius: 12 }} />;
    case 'stat':
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
          <Skeleton variant="text" width={28} height={22} />
          <Skeleton variant="text" width={38} height={14} />
        </Box>
      );
    case 'multiline':
      return (
        <Box>
          <Skeleton variant="text" width={col.width ?? 140} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={90} height={14} sx={{ borderRadius: 1 }} />
        </Box>
      );
    case 'actions':
      return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
          {Array.from({ length: col.actionCount ?? 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={30} height={30} sx={{ borderRadius: 1.5 }} />
          ))}
        </Box>
      );
    default:
      return <Skeleton variant="text" width={col.width ?? 100} height={22} sx={{ borderRadius: 1 }} />;
  }
}

interface Props {
  rows?: number;
  columns: SkeletonColumn[];
}

export function TableSkeleton({ rows = 5, columns }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {columns.map((col, colIdx) => (
            <TableCell key={colIdx} align={col.align ?? 'left'}>
              <CellContent col={col} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
