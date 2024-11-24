import React from 'react';
import { Breadcrumb } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../helpers/breadcrumbsHelper';

const Breadcrumbs = () => {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location);

  return (
    <nav className="bg-gray-100 p-3 rounded-md flex items-center" aria-label="Breadcrumb">
      <Breadcrumb className="flex space-x-2 text-sm text-gray-600">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isNonClickable = crumb.label === 'Settings' || crumb.label === 'User';

          return (
            <Breadcrumb.Item
              key={index}
              aria-current={isLast ? 'page' : undefined}
              className={`${
                isLast ? 'font-semibold text-[#333333]' : 'hover:text-[#0f0e0e] transition-colors'
              }`}
            >
              {isLast || isNonClickable ? (
                <span className="text-[#333333]">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="text-[#333333] hover:text-[#0f0e0e]">
                  {crumb.label}
                </Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </nav>
  );
};

export default Breadcrumbs;
