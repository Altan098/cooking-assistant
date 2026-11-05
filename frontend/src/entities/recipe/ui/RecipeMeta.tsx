import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import type { Recipe } from '../types';

interface Props {
  recipe: Pick<Recipe, 'cookingTime' | 'servings'>;
}

const itemStyle = { display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' };

export default function RecipeMeta({ recipe }: Props) {
  return (
    <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Typography component="span" variant="body2" sx={itemStyle}>
        <AccessTimeIcon sx={{ fontSize: 18 }} />
        {`${recipe.cookingTime} мин`}
      </Typography>
      <Typography component="span" variant="body2" sx={itemStyle}>
        <PeopleOutlinedIcon sx={{ fontSize: 18 }} />
        {`${recipe.servings} порц.`}
      </Typography>
    </Box>
  );
}
