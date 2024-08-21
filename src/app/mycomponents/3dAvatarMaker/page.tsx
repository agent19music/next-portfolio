"use client"
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { Avatar } from "@readyplayerme/visage";
import { useState } from "react";

const config: AvatarCreatorConfig = {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: false,
  language: 'en',
};

const style = { width: '100%', height: '100vh', border: 'none' };

export default function MyAvatar() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    setAvatarUrl(event.data.url);
  };

  return (
      <>
        <AvatarCreator subdomain="portfolio-ldjr65" config={config} style={style} onAvatarExported={handleOnAvatarExported} />
        {avatarUrl && <Avatar modelSrc={avatarUrl} />}
      </>
  );
}