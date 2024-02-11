export const idlFactory = ({ IDL }) => {
  const PlayerId = IDL.Principal;
  const PlayerName = IDL.Text;
  const Level = IDL.Nat;
  const Player = IDL.Record({
    'id' : PlayerId,
    'elo' : IDL.Float64,
    'name' : PlayerName,
    'level' : Level,
  });
  const PlayerPreferences = IDL.Record({
    'language' : IDL.Nat,
    'playerChar' : IDL.Text,
  });
  const TokenID = IDL.Nat;
  const Cosmicrafts = IDL.Service({
    'createPlayer' : IDL.Func([IDL.Text], [IDL.Bool, IDL.Text], []),
    'getICPBalance' : IDL.Func([], [IDL.Record({ 'e8s' : IDL.Nat64 })], []),
    'getMyPlayerData' : IDL.Func([], [IDL.Opt(Player)], ['query']),
    'getPlayer' : IDL.Func([], [IDL.Opt(Player)], []),
    'getPlayerData' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(Player)],
        ['composite_query'],
      ),
    'getPlayerElo' : IDL.Func([IDL.Principal], [IDL.Float64], ['query']),
    'getPlayerPreferences' : IDL.Func([], [IDL.Opt(PlayerPreferences)], []),
    'savePlayerChar' : IDL.Func([IDL.Text], [IDL.Bool, IDL.Text], []),
    'savePlayerLanguage' : IDL.Func([IDL.Nat], [IDL.Bool, IDL.Text], []),
    'savePlayerName' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'updatePlayerElo' : IDL.Func([IDL.Principal, IDL.Float64], [IDL.Bool], []),
    'upgradeNFT' : IDL.Func([TokenID], [IDL.Bool, IDL.Text], []),
  });
  return Cosmicrafts;
};
export const init = ({ IDL }) => { return []; };
