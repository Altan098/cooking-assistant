import { Alert, Box, Button, CircularProgress, Collapse, Stack, TextField } from '@mui/material';
import { useAuthForm } from './useAuthForm';
import type { AuthFormErrors, AuthFormValues } from './validation';

interface Field {
  name: keyof AuthFormValues;
  label: string;
  type?: string;
  autoComplete: string;
}

interface Props {
  fields: Field[];
  submitLabel: string;
  submittingLabel: string;
  validate: (values: AuthFormValues) => AuthFormErrors;
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export default function AuthForm({ fields, submitLabel, submittingLabel, validate, onSubmit }: Props) {
  const { values, errors, submitError, isSubmitting, setField, submit } = useAuthForm(validate, onSubmit);

  return (
    <Box component="form" noValidate onSubmit={submit}>
      <Collapse in={!!submitError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      </Collapse>
      <Stack spacing={2}>
        {fields.map(({ name, label, type, autoComplete }) => (
          <TextField
            key={name}
            label={label}
            type={type}
            autoComplete={autoComplete}
            fullWidth
            value={values[name]}
            onChange={(e) => setField(name, e.target.value)}
            error={!!errors[name]}
            helperText={errors[name]}
            disabled={isSubmitting}
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
