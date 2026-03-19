//components/page/HomePage/HomePage.jsx

import React from "react";
import "./HomePage.css";

import Selection from "../../common/Selection/Selection";
import Button from "@/components/common/Button/Button";

import { useHomePage } from "./useHomePage";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Footer from "@/components/layout/Footer/Footer";

const HomePage = () => {
  const { items, handleStart } = useHomePage();

  return (
    <div className="home-page">
      <h1>クイズに挑戦</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className="select-sections">
          {items.map((item, index) => {
            return (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Selection
                  label={item.label}
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  array={item.array}
                  disabled={item.disabled}
                  error={item.error}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <div className="quiz-start-button">
        <Button onClickHandler={handleStart}>クイズスタート</Button>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
