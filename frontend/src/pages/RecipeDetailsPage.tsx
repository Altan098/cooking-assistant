import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Button, Divider, Grid, Paper, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getRecipe } from '../entities/recipe/api';
import RecipeImage from '../entities/recipe/ui/RecipeImage';
import RecipeMeta from '../entities/recipe/ui/RecipeMeta';
import { useAuth } from '../features/auth';
import { DeleteRecipeButton } from '../features/recipe-delete';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const recipeId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const request = useRequest(() => getRecipe(recipeId), [recipeId]);
  useDocumentTitle(request.data?.title ?? 'Рецепт');

  return (
    <Box component="div">
      <Button
        component={RouterLink}
        to="/recipes"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, ml: -1 }}
      >
        Назад
      </Button>

      <DataState request={request}>
        {(recipe) => (
          <>
            <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center', mb: 5 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box component="div" sx={{ borderRadius: '24px', overflow: 'hidden' }}>
                  <RecipeImage
                    src={recipe.image}
                    alt={recipe.title}
                    height={{ xs: 260, md: 400 }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{ fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.15, mb: 2 }}
                >
                  {recipe.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.0625rem', mb: 2 }}>
                  {recipe.description}
                </Typography>
                <RecipeMeta recipe={recipe} />

                {user?.id === recipe.authorId && (
                  <Stack component="div" direction="row" spacing={1} sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to={`/recipes/${recipe.id}/edit`}
                    >
                      Изменить
                    </Button>
                    <DeleteRecipeButton recipe={recipe} onDeleted={() => navigate('/recipes')} />
                  </Stack>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={{ xs: 3, md: 5 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, position: { md: 'sticky' }, top: { md: 96 } }}
                >
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    Ингредиенты
                  </Typography>
                  {recipe.ingredients.map((item, index) => (
                    <Box key={item.id} component="div">
                      {index > 0 && <Divider />}
                      <Box
                        component="div"
                        sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25 }}
                      >
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'right' }}
                        >
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                  Приготовление
                </Typography>
                <Stack component="ol" spacing={3} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {recipe.steps.map((step, index) => (
                    <Box key={index} component="li" sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        component="span"
                        aria-hidden
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'primary.main',
                          color: '#FFFFFF',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ pt: 0.75 }}>{step}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </>
        )}
      </DataState>
    </Box>
  );
}
