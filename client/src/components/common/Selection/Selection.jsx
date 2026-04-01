import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

export default function Selection({
  error,
  label,
  value,
  onChange,
  array,
  disabled,
}) {
  const labelId = `${label}-select-label`;
  const selectId = `${label}-select`;
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl error={error} fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={value}
          label={label}
          onChange={onChange}
          disabled={disabled}
        >
          {array.map((arr) => {
            return (
              <MenuItem key={arr.id} value={arr.value}>
                {arr.title}
              </MenuItem>
            );
          })}
        </Select>
        {error && <FormHelperText>選択してください</FormHelperText>}
      </FormControl>
    </Box>
  );
}
