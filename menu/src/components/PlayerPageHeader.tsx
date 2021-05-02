import React, { useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Search, SortByAlpha } from "@material-ui/icons";
import {
  PlayerDataSort,
  usePlayersSortBy,
  usePlayersState,
  useSetPlayerFilter,
} from "../state/players.state";
import { useDebounce } from "../hooks/useDebouce";
import {useServerCtxValue} from "../state/server.state";

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 600,
  },
  playerCount: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  inputs: {
    minWidth: 150,
  },
}));

export const PlayerPageHeader: React.FC = () => {
  const classes = useStyles();
  const [sortType, setSortType] = usePlayersSortBy();
  const setPlayerFilter = useSetPlayerFilter();
  const allPlayers = usePlayersState();
  const [searchVal, setSearchVal] = useState("");
  const serverCtx = useServerCtxValue()

  const debouncedInput = useDebounce(searchVal, 500);

  // We might need to debounce this in the future
  const handleSortData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortType(e.target.value as PlayerDataSort);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    setPlayerFilter(debouncedInput as string);
  }, [debouncedInput, setPlayerFilter]);

  return (
    <Box display="flex" justifyContent="space-between">
      <Box px={2}>
        <Typography variant="h5" color="primary" className={classes.title}>
          ONLINE PLAYERS
        </Typography>
        <Typography className={classes.playerCount}>
          {`${allPlayers.length}/${serverCtx.maxClients} Players - OneSync (${serverCtx.oneSync.type})`}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <TextField
          label="Search"
          value={searchVal}
          onChange={handleSearchChange}
          className={classes.inputs}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className={classes.icon}>
                <Search color="inherit" />
              </InputAdornment>
            ),
          }}
          style={{ marginRight: 20 }}
        />
        <TextField
          label="Sort by"
          select
          className={classes.inputs}
          onChange={handleSortData}
          value={sortType}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className={classes.icon}>
                <SortByAlpha color="inherit" />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value={PlayerDataSort.IdJoinedFirst}>
            ID (Joined First)
          </MenuItem>
          <MenuItem value={PlayerDataSort.IdJoinedLast}>
            ID (Joined Last)
          </MenuItem>
          <MenuItem value={PlayerDataSort.DistanceClosest}>
            Distance (Closest)
          </MenuItem>
          <MenuItem value={PlayerDataSort.DistanceFarthest}>
            Distance (Farthest)
          </MenuItem>
        </TextField>
      </Box>
    </Box>
  );
};