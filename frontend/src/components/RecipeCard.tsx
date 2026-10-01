import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Recipe } from '../types/recipe';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={recipe.image}
        alt={recipe.title}
        sx={{
          height: 200,
          width: '100%',
          objectFit: 'cover',
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{recipe.title}</Typography>
        <Typography component="p" variant="body2" color="text.secondary">
          {recipe.description}
        </Typography>
        <Typography component="p" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {`${recipe.cookingTime} мин · ${recipe.servings} порц.`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/recipes/${recipe.id}`}>
          Подробнее
        </Button>
      </CardActions>
    </Card>
  );
}