const Year = () => {
  const years = ["1st", "2nd", "3rd", "4th"];

  return (
    <div className="h-auto w-auto">
      <div className="h-10 bg-black w-auto text-black flex">
        
        {years.map((year, index) => (
          <div key={index}>{year}</div>
        ))}
      </div>
    </div>
  );
};

export default Year;
