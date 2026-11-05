import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Recipe } from '../types';
import RecipeImage from './RecipeImage';
import RecipeMeta from './RecipeMeta';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 30px rgba(67, 42, 24, 0.12)' },
        '&:hover img': { transform: 'scale(1.04)' },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/recipes/${recipe.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box component="div" sx={{ overflow: 'hidden' }}>
          <RecipeImage src={recipe.image} alt={recipe.title} height={210} />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" component="h2" sx={{ lineHeight: 1.3 }}>
            {recipe.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {recipe.description}
          </Typography>
          <RecipeMeta recipe={recipe} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
