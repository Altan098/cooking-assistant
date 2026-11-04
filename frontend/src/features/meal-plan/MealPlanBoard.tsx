import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { useRequest } from '../../shared/lib/useRequest';
import DataState from '../../shared/ui/DataState';
import { deleteMealPlanEntry, getMealPlan, setMealPlanEntry } from './api';
import type { MealType } from './api';
import RecipePickerDialog from './RecipePickerDialog';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const meals: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Завтрак' },
  { type: 'lunch', label: 'Обед' },
  { type: 'dinner', label: 'Ужин' },
];

interface Slot {
  day: number;
  meal: MealType;
  label: string;
}

export default function MealPlanBoard() {
  const request = useRequest(getMealPlan, []);
  const { setData } = request;
  const [slot, setSlot] = useState<Slot | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const withoutSlot = <T extends { day: number; meal: MealType }>(
    entries: T[] | null,
    day: number,
    meal: MealType
  ) => (entries ?? []).filter((e) => e.day !== day || e.meal !== meal);

  const handleSelect = async (recipeId: number) => {
    if (!slot) return;
    const { day, meal } = slot;
    setActionError(null);
    try {
      const entry = await setMealPlanEntry(day, meal, recipeId);
      setData((prev) => [...withoutSlot(prev, day, meal), entry]);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Не удалось сохранить меню');
    }
    setSlot(null);
  };

  const handleClear = async (day: number, meal: MealType) => {
    setActionError(null);
    try {
      await deleteMealPlanEntry(day, meal);
      setData((prev) => withoutSlot(prev, day, meal));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Не удалось изменить меню');
    }
  };

  return (
    <Box component="div">
      <Collapse in={!!actionError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      </Collapse>

      <DataState request={request}>
        {(entries) => (
          <Grid container spacing={1}>
            {days.map((dayName, day) => (
              <Grid key={dayName} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    {dayName}
                  </Typography>
                  {meals.map(({ type, label }) => {
                    const entry = entries.find((e) => e.day === day && e.meal === type);
                    return (
                      <Paper key={type} variant="outlined" sx={{ p: 1, my: 0.5, minHeight: 72 }}>
                        <Typography
                          component="p"
                          variant="caption"
                          color="text.secondary"
                        >
                          {label}
                        </Typography>
                        {entry ? (
                          <Box
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <Link
                              component={RouterLink}
                              to={`/recipes/${entry.recipe.id}`}
                              variant="body2"
                              sx={{ flexGrow: 1 }}
                            >
                              {entry.recipe.title}
                            </Link>
                            <IconButton
                              size="small"
                              aria-label={`Очистить: ${dayName}, ${label}`}
                              onClick={() => handleClear(day, type)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            aria-label={`Выбрать: ${dayName}, ${label}`}
                            onClick={() =>
                              setSlot({ day, meal: type, label: `${dayName}, ${label}` })
                            }
                          >
                            Выбрать
                          </Button>
                        )}
                      </Paper>
                    );
                  })}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DataState>

      {slot && (
        <RecipePickerDialog
          title={slot.label}
          onClose={() => setSlot(null)}
          onSelect={handleSelect}
        />
      )}
    </Box>
  );
}
