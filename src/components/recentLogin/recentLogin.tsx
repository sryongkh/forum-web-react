import React from "react";

interface RecentLoginButtonProps {
  email: string;
  onClick: (email: string) => void;
}

const RecentLoginButton: React.FC<RecentLoginButtonProps> = ({
  email,
  onClick,
}) => {
  const handleClick = () => {
    onClick(email);
  };

  return (
    <button
      className="h-24 w-full px-4 rounded-md bg-slate-400 flex items-center justify-center text-white cursor-pointer"
      onClick={handleClick}
    >
      {email}
    </button>
  );
};

export default RecentLoginButton;
