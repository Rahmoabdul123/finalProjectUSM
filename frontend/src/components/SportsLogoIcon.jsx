
export const getSportLogo = (sportName) => {
    const name = sportName.toLowerCase();
    if (name.includes("football")) return "/images/football.png";
    if (name.includes("hockey")) return "/images/Hockey-removebg.png";
    if (name.includes("basketball")) return "/images/Basketball-removebg.png";
    return "/images/logoFinal.png";
  };