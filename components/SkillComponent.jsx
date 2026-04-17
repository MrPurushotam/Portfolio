const SkillComponent = ({ tag, link }) => {
  return (
    <div className="group flex items-center gap-3 p-2 mx-auto w-full max-w-[200px] h-full rounded-xl bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 cursor-default">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center p-1.5 sm:p-2 bg-white/90 dark:bg-white/80 rounded-lg group-hover:bg-white transition-colors duration-300 shadow-sm border border-black/5 dark:border-white/10">
        <img
          src={link}
          alt={tag.replace(/\s+/g, '-')}
          className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base capitalize truncate pr-2">
        {tag}
      </span>
    </div>
  );
};

export default SkillComponent;
