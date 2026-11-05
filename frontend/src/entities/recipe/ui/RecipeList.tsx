import { Alert, Box, Button, Card, CircularProgress, Fade, Grid, Skeleton } from '@mui/material';
import DataState from '../../../shared/ui/DataState';
import type { RecipeFilters } from '../api';
import { useRecipeList } from '../useRecipeList';
import RecipeCard from './RecipeCard';

interface Props {
  filters?: RecipeFilters;
  emptyText: string;
}

const gridItem = { xs: 12, sm: 6, md: 4 };

function RecipeGridSkeleton() {
  return (
    <Grid container spacing={3} aria-label="Загрузка рецептов">
      {[0, 1, 2].map((key) => (
        <Grid key={key} size={gridItem}>
          <Card>
            <Skeleton variant="rectangular" height={210} />
            <Box component="div" sx={{ p: 2 }}>
              <Skeleton width="70%" height={28} />
              <Skeleton width="90%" />
              <Skeleton width="40%" />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function RecipeList({ filters = {}, emptyText }: Props) {
  const { request, loadMore, isLoadingMore, loadMoreError } = useRecipeList(filters);

  return (
    <DataState
      request={request}
      isEmpty={(page) => page.items.length === 0}
      emptyText={emptyText}
      loader={<RecipeGridSkeleton />}
    >
      {({ items, total }) => (
        <>
          <Grid container spacing={3}>
            {items.map((r) => (
              <Grid key={r.id} size={gridItem}>
                <Fade in timeout={400}>
                  <div style={{ height: '100%' }}>
                    <RecipeCard recipe={r} />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {loadMoreError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {loadMoreError}
            </Alert>
          )}

          {items.length < total && (
            <Box component="div" sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={isLoadingMore}
                startIcon={isLoadingMore ? <CircularProgress size={18} /> : null}
              >
                Показать ещё
              </Button>
            </Box>
          )}
        </>
      )}
    </DataState>
  );
}
