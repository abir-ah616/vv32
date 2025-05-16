import React from 'react';
import { useTournament } from '../contexts/TournamentContext';

interface HeaderProps {
  isEditor?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isEditor = false }) => {
  const { tournamentInfo } = useTournament();
  
  if (isEditor) {
    return null; // No header in editor mode
  }

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center tournament-header">
      {/* Week/Day */}
      {tournamentInfo.showWeekDay && (
        <div className="text-xl font-orbitron text-white text-left">
          <span className="font-bold">Week {tournamentInfo.weekNumber}</span>
          <span className="mx-2">•</span>
          <span className="font-bold">Day {tournamentInfo.dayNumber}</span>
        </div>
      )}
      
      {/* Host Name + Presents */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold uppercase tracking-wider text-gradient">
          {tournamentInfo.hostName}
        </h2>
        {tournamentInfo.showPresents && (
          <div className="text-sm uppercase tracking-widest mt-1 opacity-80">
            PRESENTS
          </div>
        )}
      </div>
      
      {/* Logo */}
      {tournamentInfo.showLogo && tournamentInfo.logoUrl && (
        <div className="h-16 w-16">
          <img 
            src={tournamentInfo.logoUrl} 
            alt="Tournament Logo" 
            className="h-full w-full object-contain"
          />
        </div>
      )}
      
      {/* Empty div for balance if no logo */}
      {(!tournamentInfo.showLogo || !tournamentInfo.logoUrl) && (
        <div className="w-16"></div>
      )}
    </div>
  );
};

export default Header;