import { Box, Button, Card, CardActionArea, Grid, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getRecipes } from '../entities/recipe/api';
import type { Recipe } from '../entities/recipe/types';
import RecipeCard from '../entities/recipe/ui/RecipeCard';
import RecipeImage from '../entities/recipe/ui/RecipeImage';
import { SearchBar } from '../features/recipe-search';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

const features = [
  {
    to: '/recipes',
    icon: MenuBookOutlinedIcon,
    title: 'Коллекция рецептов',
    text: 'Сохраняйте свои блюда и находите новые идеи в общем каталоге.',
  },
  {
    to: '/shopping-list',
    icon: ShoppingBasketOutlinedIcon,
    title: 'Список покупок',
    text: 'Держите список под рукой и отмечайте купленное прямо в магазине.',
  },
  {
    to: '/meal-plan',
    icon: CalendarMonthOutlinedIcon,
    title: 'Меню на неделю',
    text: 'Распределите завтраки, обеды и ужины и не думайте об этом каждый вечер.',
  },
];

function HeroPhotos({ recipes }: { recipes: Recipe[] }) {
  const photos = recipes.filter((r) => r.image).slice(0, 3);
  if (photos.length === 0) return null;

  return (
    <Box
      component="div"
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: '3fr 2fr',
        gridTemplateRows: { xs: '130px 130px', md: '190px 190px' },
      }}
    >
      {photos.map((recipe, index) => (
        <Box
          key={recipe.id}
          component={RouterLink}
          to={`/recipes/${recipe.id}`}
          aria-label={recipe.title}
          sx={{
            display: 'block',
            overflow: 'hidden',
            borderRadius: '20px',
            gridRow: index === 0 ? 'span 2' : undefined,
            gridColumn: photos.length === 1 ? 'span 2' : undefined,
            '&:hover img': { transform: 'scale(1.05)' },
          }}
        >
          <RecipeImage src={recipe.image} alt={recipe.title} height="100%" />
        </Box>
      ))}
    </Box>
  );
}

export default function HomePage() {
  useDocumentTitle();
  const navigate = useNavigate();
  const request = useRequest(() => getRecipes({ limit: 6 }), []);
  const recipes = request.data?.items ?? [];
  const total = request.data?.total;

  return (
    <Box component="div">
      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center', mb: { xs: 6, md: 9 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: 1.5 }}
          >
            {total ? `Рецептов в каталоге: ${total}` : 'Домашняя кухня без лишних хлопот'}
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, lineHeight: 1.1, mt: 1, mb: 2 }}
          >
            Что приготовить сегодня?
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.125rem', mb: 3 }}>
            Найдите блюдо по продуктам из холодильника, составьте меню на неделю и список покупок.
          </Typography>
          <SearchBar
            onSearch={(query) =>
              navigate(query ? `/search?ingredient=${encodeURIComponent(query)}` : '/search')
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <HeroPhotos recipes={recipes} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: { xs: 6, md: 9 } }}>
        {features.map(({ to, icon: Icon, title, text }) => (
          <Grid key={to} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea component={RouterLink} to={to} sx={{ height: '100%', p: 3 }}>
                <Box
                  component="span"
                  sx={{
                    width: 48,
                    height: 48,
                    mb: 2,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(181, 71, 46, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {text}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h2">
          Новые рецепты
        </Typography>
        <Button component={RouterLink} to="/recipes">
          Весь каталог
        </Button>
      </Box>
      <DataState
        request={request}
        isEmpty={(page) => page.items.length === 0}
        emptyText="Рецептов пока нет. Станьте первым автором!"
      >
        {({ items }) => (
          <Grid container spacing={3}>
            {items.map((recipe) => (
              <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        )}
      </DataState>
    </Box>
  );
}
