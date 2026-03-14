const SkillComponent = ({ tag, link }) => {
  return (
    <div className="w-full h-auto p-2 sm:p-3 flex flex-col sm:flex-row items-center sm:justify-between rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 overflow-hidden  ">
      <div className="w-16 sm:w-20 lg:w-24 overflow-hidden flex-shrink-0">
        <img
          src={link}
          alt={tag.split(" ").join("-")}
          className="aspect-[3/2] w-full object-contain hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </div>
      <div className="mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <span className="text-gray-800 dark:text-gray-100 capitalize text-lg sm:text-xl lg:text-2xl tracking-tight font-medium truncate">
          {tag}
        </span>
      </div>
    </div>
  );
};

export default SkillComponent;
