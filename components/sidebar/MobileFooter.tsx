'use client'
import useConversation from '@/hooks/useConversation';
import useRoutes from '@/hooks/useRoutes'
import React from 'react'
import MobileItem from './MobileItem';

const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    if (isOpen) {
        return null
    }
  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          active={route.active}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}

export default MobileFooter