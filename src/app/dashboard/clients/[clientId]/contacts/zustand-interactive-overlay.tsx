'use client';

import { ReactNode, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import useMediaQuery from '@/hooks/use-media-query';
import { useOverlayStore } from '@/store/overlayStore';

type Props = {
  title: string;
  description: string;
  form: ReactNode;
};

export function ZustandInteractiveOverlay({ title, description, form }: Props) {
  const { isMobile } = useMediaQuery();
  const preventCloseRef = useRef(false);
  const { isOpen, setIsOpen } = useOverlayStore();

  console.log('ZustandInteractiveOverlay rendered, isOpen:', isOpen);

  const Content = isMobile ? Drawer : Sheet;
  const ContentInner = isMobile ? DrawerContent : SheetContent;
  const Header = isMobile ? DrawerHeader : SheetHeader;
  const Title = isMobile ? DrawerTitle : SheetTitle;
  const Description = isMobile ? DrawerDescription : SheetDescription;

  return (
    <Content
      open={isOpen}
      onOpenChange={value => {
        if (preventCloseRef.current) return;
        setIsOpen(value);
      }}
    >
      <ContentInner>
        <Header className="px-2">
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        <ScrollArea className="h-[95%] pr-8 pt-4 pb-8">{form}</ScrollArea>
      </ContentInner>
    </Content>
  );
}
