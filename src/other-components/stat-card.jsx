import React from "react";

const StatCard = ({ loading, title, value, icon, color }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 flex justify-between items-center">
        {loading ? (
          <div className="animate-pulse w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {title}
            </h4>
            <h2 className={`text-2xl font-bold ${colorClasses[color].text}`}>
              {value}
            </h2>
          </div>
        )}
        <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
          {React.cloneElement(icon, {
            className: `${icon.props.className} text-xl`,
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
