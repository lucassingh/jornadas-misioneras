import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { Calendar, Globe, MapPin, TrendingUp, Clock, CalendarCheck } from 'lucide-react';
import { prisma } from '@jornadas/database';
import { Jumbotron } from '@/components/dashboard/Jumbotron';
import { COLOR_TOKENS } from '@jornadas/ui';
import { format, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata: Metadata = { title: 'Dashboard' };

const PAGE_SIZE = 4;

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } });
  const isAdmin = dbUser?.role === 'ADMIN';
  const where = isAdmin ? {} : { createdBy: userId };

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    totalEvents,
    totalCountries,
    totalLocations,
    eventsThisMonth,
    upcomingEvents,
    eventsByCountry,
  ] = await Promise.all([
    prisma.event.count({ where }),
    isAdmin ? prisma.country.count() : Promise.resolve(null),
    isAdmin ? prisma.location.count() : Promise.resolve(null),
    prisma.event.count({ where: { ...where, startDate: { gte: monthStart, lte: monthEnd } } }),
    prisma.event.findMany({
      where: { ...where, startDate: { gte: now } },
      include: { country: true, location: true, province: true },
      orderBy: { startDate: 'asc' },
      take: 5,
    }),
    isAdmin
      ? prisma.event.groupBy({
          by: ['countryId'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  // Fetch country names for distribution
  const countryIds = (eventsByCountry as { countryId: number; _count: { id: number } }[]).map((e) => e.countryId);
  const countries = countryIds.length
    ? await prisma.country.findMany({ where: { id: { in: countryIds } } })
    : [];

  const countryMap = Object.fromEntries(countries.map((c) => [c.id, c.name]));
  const maxCount = Math.max(...(eventsByCountry as { _count: { id: number } }[]).map((e) => e._count.id), 1);

  const statCards = [
    {
      label: isAdmin ? 'Total Eventos' : 'Mis Eventos',
      value: totalEvents,
      icon: <Calendar size={22} />,
      accent: COLOR_TOKENS.extra2,
    },
    {
      label: 'Este mes',
      value: eventsThisMonth,
      icon: <CalendarCheck size={22} />,
      accent: COLOR_TOKENS.secondary,
    },
    ...(isAdmin
      ? [
          { label: 'Países', value: totalCountries, icon: <Globe size={22} />, accent: COLOR_TOKENS.extra2 },
          { label: 'Localidades', value: totalLocations, icon: <MapPin size={22} />, accent: COLOR_TOKENS.extra1 },
        ]
      : []),
  ];

  return (
    <>
      <Jumbotron
        title="Dashboard"
        subtitle={isAdmin ? 'Resumen general de la plataforma' : 'Resumen de tus eventos'}
      />
      <Box sx={{ px: 3, pb: 3 }}>

        {/* Stat cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {statCards.map((card) => (
            <Grid item xs={6} sm={3} key={card.label}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h4" fontWeight={700} lineHeight={1}>
                        {card.value ?? 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {card.label}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: `${card.accent}18`,
                        color: card.accent,
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${card.accent}33`,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2.5}>
          {/* Próximos eventos */}
          <Grid item xs={12} md={isAdmin ? 7 : 12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                  <Clock size={18} color={COLOR_TOKENS.extra2} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Próximos eventos
                  </Typography>
                </Box>

                {upcomingEvents.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      No hay eventos próximos
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {upcomingEvents.map((event, i) => {
                      const daysLeft = differenceInDays(new Date(event.startDate), now);
                      const isVeryClose = daysLeft <= 7;
                      const isToday = daysLeft === 0;

                      return (
                        <Box key={event.id}>
                          {i > 0 && <Divider sx={{ my: 1.5 }} />}
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box
                              sx={{
                                minWidth: 48,
                                height: 52,
                                borderRadius: 2,
                                bgcolor: isVeryClose ? `${COLOR_TOKENS.extra1}18` : `${COLOR_TOKENS.extra2}18`,
                                border: `1px solid ${isVeryClose ? COLOR_TOKENS.extra1 : COLOR_TOKENS.extra2}33`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{ color: isVeryClose ? COLOR_TOKENS.extra1 : COLOR_TOKENS.extra2, lineHeight: 1, fontSize: '0.7rem' }}
                              >
                                {format(new Date(event.startDate), 'MMM', { locale: es }).toUpperCase()}
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ color: isVeryClose ? COLOR_TOKENS.extra1 : COLOR_TOKENS.extra2, lineHeight: 1 }}
                              >
                                {format(new Date(event.startDate), 'd')}
                              </Typography>
                            </Box>

                            <Box flex={1} minWidth={0}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {event.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {event.location.name}, {event.province.name} · {event.country.name}
                              </Typography>
                            </Box>

                            <Chip
                              label={isToday ? 'Hoy' : daysLeft === 1 ? 'Mañana' : `${daysLeft}d`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                bgcolor: isVeryClose ? `${COLOR_TOKENS.extra1}18` : `${COLOR_TOKENS.extra2}18`,
                                color: isVeryClose ? COLOR_TOKENS.extra1 : COLOR_TOKENS.extra2,
                                border: `1px solid ${isVeryClose ? COLOR_TOKENS.extra1 : COLOR_TOKENS.extra2}44`,
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Distribución por país (solo admin) */}
          {isAdmin && (
            <Grid item xs={12} md={5}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                    <TrendingUp size={18} color={COLOR_TOKENS.extra2} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Eventos por país
                    </Typography>
                  </Box>

                  {(eventsByCountry as { countryId: number; _count: { id: number } }[]).length === 0 ? (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body2" color="text.secondary">
                        Sin datos aún
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(eventsByCountry as { countryId: number; _count: { id: number } }[]).map((item, i) => {
                        const pct = Math.round((item._count.id / maxCount) * 100);
                        const colors = [COLOR_TOKENS.brand, COLOR_TOKENS.extra1, COLOR_TOKENS.extra2, COLOR_TOKENS.secondary, '#7c3aed'];
                        const color = colors[i % colors.length];

                        return (
                          <Box key={item.countryId}>
                            <Box display="flex" justifyContent="space-between" mb={0.75}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${color}22`, color }}>
                                  {(countryMap[item.countryId] ?? '?')[0]}
                                </Avatar>
                                <Typography variant="body2" fontWeight={500}>
                                  {countryMap[item.countryId] ?? 'Desconocido'}
                                </Typography>
                              </Box>
                              <Typography variant="caption" fontWeight={700} sx={{ color }}>
                                {item._count.id} {item._count.id === 1 ? 'evento' : 'eventos'}
                              </Typography>
                            </Box>
                            <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'divider', overflow: 'hidden' }}>
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${pct}%`,
                                  bgcolor: color,
                                  borderRadius: 3,
                                  transition: 'width 0.6s ease',
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
