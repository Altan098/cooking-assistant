import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { getErrorMessage } from '../../shared/api/client';
import { useRequest } from '../../shared/lib/useRequest';
import DataState from '../../shared/ui/DataState';
import { deleteMealPlanEntry, getMealPlan, setMealPlanEntry } from './api';
import type { MealPlanEntry, MealType } from './api';
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

function withoutSlot(entries: MealPlanEntry[] | null, day: number, meal: MealType) {
  return (entries ?? []).filter((e) => e.day !== day || e.meal !== meal);
}

export default function MealPlanBoard() {
  const request = useRequest(getMealPlan, []);
  const { setData } = request;
  const [slot, setSlot] = useState<Slot | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // getDay() считает неделю с воскресенья, а меню с понедельника.
  const [today] = useState(() => (new Date().getDay() + 6) % 7);

  const handleSelect = async (recipeId: number) => {
    if (!slot) return;
    const { day, meal } = slot;
    setActionError(null);
    try {
      const entry = await setMealPlanEntry(day, meal, recipeId);
      setData((prev) => [...withoutSlot(prev, day, meal), entry]);
    } catch (e) {
      setActionError(getErrorMessage(e));
    }
    setSlot(null);
  };

  const handleClear = async (day: number, meal: MealType) => {
    setActionError(null);
    try {
      await deleteMealPlanEntry(day, meal);
      setData((prev) => withoutSlot(prev, day, meal));
    } catch (e) {
      setActionError(getErrorMessage(e));
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
          <Box
            component="div"
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(7, 1fr)',
              },
            }}
          >
            {days.map((dayName, day) => (
              <Paper
                key={dayName}
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderColor: day === today ? 'primary.main' : undefined,
                  borderWidth: day === today ? 2 : 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  color={day === today ? 'primary' : 'textPrimary'}
                  sx={{ textAlign: 'center', mb: 1 }}
                >
                  {dayName}
                </Typography>
                {meals.map(({ type, label }) => {
                  const entry = entries.find((e) => e.day === day && e.meal === type);
                  return (
                    <Box
                      key={type}
                      component="div"
                      sx={{
                        p: 1,
                        mb: 1,
                        minHeight: 92,
                        borderRadius: '12px',
                        bgcolor: entry ? 'rgba(181, 71, 46, 0.08)' : 'background.default',
                      }}
                    >
                      <Typography component="p" variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      {entry ? (
                        <Box component="div" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.25 }}>
                          <Link
                            component={RouterLink}
                            to={`/recipes/${entry.recipe.id}`}
                            variant="body2"
                            underline="hover"
                            sx={{ flexGrow: 1, minWidth: 0, fontWeight: 600, overflowWrap: 'anywhere' }}
                          >
                            {entry.recipe.title}
                          </Link>
                          <IconButton
                            size="small"
                            aria-label={`Очистить: ${dayName}, ${label}`}
                            onClick={() => handleClear(day, type)}
                            sx={{ mt: -0.5, mr: -0.5 }}
                          >
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          aria-label={`Выбрать: ${dayName}, ${label}`}
                          onClick={() => setSlot({ day, meal: type, label: `${dayName}, ${label}` })}
                          sx={{ px: 0.5, minWidth: 0 }}
                        >
                          Выбрать
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Paper>
            ))}
          </Box>
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
