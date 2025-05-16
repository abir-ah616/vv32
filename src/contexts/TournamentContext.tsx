import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define team types
export interface Team {
  id: string;
  name: string;
  logo: string;
  wins: number;
  pp: number; // Placement Points
  kp: number; // Kill Points
  total?: number; // Calculated field
  rank?: number; // Calculated field
}

// Define tournament metadata
export interface TournamentInfo {
  hostName: string;
  showPresents: boolean;
  weekNumber: number;
  dayNumber: number;
  showWeekDay: boolean;
  logoUrl: string;
  showLogo: boolean;
  facebook: string;
  instagram: string;
  youtube: string;
  showSocial: boolean;
}

// Context type definition
interface TournamentContextType {
  teams: Team[];
  tournamentInfo: TournamentInfo;
  updateTeam: (id: string, data: Partial<Team>) => void;
  updateTournamentInfo: (data: Partial<TournamentInfo>) => void;
  getTeamsByRank: () => Team[];
  resetToDefault: () => void;
}

// Default values
const defaultTeams: Team[] = Array(12).fill(null).map((_, index) => ({
  id: `team-${index + 1}`,
  name: `Team ${index + 1}`,
  logo: '',
  wins: 0,
  pp: 0,
  kp: 0,
}));

const defaultTournamentInfo: TournamentInfo = {
  hostName: 'Esports Host',
  showPresents: true,
  weekNumber: 1,
  dayNumber: 1,
  showWeekDay: true,
  logoUrl: '',
  showLogo: true,
  facebook: 'esports.tournament',
  instagram: 'esports.tournament',
  youtube: '@esportstournament',
  showSocial: true,
};

// Create context
const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Provider component
export const TournamentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : defaultTeams;
  });

  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>(() => {
    const savedInfo = localStorage.getItem('tournamentInfo');
    return savedInfo ? JSON.parse(savedInfo) : defaultTournamentInfo;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('tournamentInfo', JSON.stringify(tournamentInfo));
  }, [tournamentInfo]);

  // Update a team's data
  const updateTeam = (id: string, data: Partial<Team>) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === id ? { ...team, ...data } : team
      )
    );
  };

  // Update tournament info
  const updateTournamentInfo = (data: Partial<TournamentInfo>) => {
    setTournamentInfo(prev => ({ ...prev, ...data }));
  };

  // Get teams sorted by rank
  const getTeamsByRank = () => {
    // Calculate total points and assign ranks
    return [...teams]
      .map(team => ({
        ...team,
        total: (team.pp + team.kp)
      }))
      .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
      .map((team, index) => ({
        ...team,
        rank: index + 1
      }));
  };

  // Reset to default values
  const resetToDefault = () => {
    setTeams(defaultTeams);
    setTournamentInfo(defaultTournamentInfo);
  };

  return (
    <TournamentContext.Provider value={{
      teams,
      tournamentInfo,
      updateTeam,
      updateTournamentInfo,
      getTeamsByRank,
      resetToDefault
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

// Custom hook to use the tournament context
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};