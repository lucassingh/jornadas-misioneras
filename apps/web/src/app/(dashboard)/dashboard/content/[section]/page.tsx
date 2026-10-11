export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@jornadas/database';
import { Jumbotron } from '@/components/dashboard/Jumbotron';
import { SectionEditor, type SectionFormValues } from '@/components/dashboard/content/SectionEditor';
import { isSectionKey, mergeSectionContent, SECTIONS } from '@/lib/content';

interface Props {
  params: { section: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return { title: isSectionKey(params.section) ? SECTIONS[params.section].label : 'Contenido del sitio' };
}

export default async function ContentSectionPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  if (!isSectionKey(params.section)) notFound();
  const key = params.section;
  const def = SECTIONS[key];

  const row = await prisma.siteContent.findUnique({ where: { key } }).catch(() => null);
  const data = mergeSectionContent(key, row?.data);

  return (
    <>
      <Jumbotron
        title={def.label}
        subtitle={def.description}
        dataTour="contentEditor.jumbotron"
        action={
          <IconButton component={Link} href="/dashboard/content" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            <ArrowLeft size={20} />
          </IconButton>
        }
      />
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <SectionEditor
          sectionKey={key}
          initialData={data as unknown as SectionFormValues}
          updatedAt={row?.updatedAt.toISOString() ?? null}
          isCustomized={!!row}
        />
      </Box>
    </>
  );
}
