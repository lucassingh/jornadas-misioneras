'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiPagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { COLOR_TOKENS } from '@jornadas/ui';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function PaginationBar({ page, totalPages, total, pageSize }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const from = total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  const handlePageSizeChange = (newSize: number) => {
    router.push(`${pathname}?page=1&pageSize=${newSize}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          Mostrar
        </Typography>
        <Select
          value={PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : PAGE_SIZE_OPTIONS[0]}
          onChange={(e: SelectChangeEvent<number>) => handlePageSizeChange(Number(e.target.value))}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.75rem',
            height: 28,
            minWidth: 58,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
            '& .MuiSelect-select': { py: '3px !important', px: '8px !important' },
          }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <MenuItem key={size} value={size} dense sx={{ fontSize: '0.8rem' }}>
              {size}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {total === 0
            ? 'Sin resultados'
            : `Mostrando ${from}–${to} de ${total}`}
        </Typography>
      </Box>

      {totalPages > 1 && (
        <MuiPagination
          count={totalPages}
          page={page}
          size="small"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={
                item.page
                  ? `${pathname}?page=${item.page}&pageSize=${pageSize}`
                  : `${pathname}?pageSize=${pageSize}`
              }
              {...item}
              sx={{
                borderRadius: 1.5,
                fontWeight: 500,
                '&.Mui-selected': {
                  bgcolor: COLOR_TOKENS.brand,
                  color: '#fff',
                  '&:hover': { bgcolor: COLOR_TOKENS.brand, opacity: 0.9 },
                },
                '&:hover': { bgcolor: `${COLOR_TOKENS.brand}15` },
              }}
            />
          )}
        />
      )}
    </Box>
  );
}
