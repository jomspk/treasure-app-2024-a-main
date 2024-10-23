import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Top() {
  const navigator = useNavigate();

  const onClick = () => {
    navigator("/question/create");
  };

  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      container
      sx={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Stack
        alignItems="center"
        gap={4}
        sx={{
          p: 8,
        }}
      >
        <img src="/qflow-icon-large.png" width={256} />
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            fontSize: "4rem",
            fontWeight: "bold",
          }}
        >
          Create Questions Effortlessly
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "1rem",
            color: "gray",
            fontWeight: "bold",
          }}
        >
          質問にかかる時間を減らして業務の生産性を向上させましょう
        </Typography>
        <Button
          onClick={onClick}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            py: 1,
            fontWeight: "bold",
            fontSize: "1rem",
            my: 4,
          }}
        >
          質問を作る
        </Button>
        <Stack
          direction="row"
          justifyContent="space-around"
          sx={{
            width: "100%",
            px: 8,
          }}
        >
          <Stack alignItems="center" gap={0.5} flex={1}>
            <AccessTimeIcon sx={{ fontSize: 48, color: "gray" }} />
            <Typography
              sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
            >
              Save Time
            </Typography>
          </Stack>
          <Stack alignItems="center" gap={0.5} flex={1}>
            <CreateOutlinedIcon sx={{ fontSize: 48, color: "gray" }} />
            <Typography
              sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
            >
              Easy to Use
            </Typography>
          </Stack>
          <Stack alignItems="center" gap={0.5} flex={1}>
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 48, color: "gray" }} />
            <Typography
              sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
            >
              Intelligent Suggest
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
}

export default Top;
