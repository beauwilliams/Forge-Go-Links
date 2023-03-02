import logo from '../assets/horizontal-logo-gradient-blue-atlassian.png';
import Typography from '@mui/material/Typography';
import { Link as MuiLink, Stack, Popover } from '@mui/material';
import React from 'react';
import { Link } from '../golink/links';

interface ExternalLinkProps {
  title: string;
  link: string;
}

function ExternalLink({ title, link }: ExternalLinkProps) {
  // return (
  //   <MuiLink
  //     href={link}
  //     onClick={() => {
  //       chrome.tabs.create({
  //         url: link,
  //       });
  //     }}
  //   >
  //     {title}
  //   </MuiLink>
  // );
  return (<MuiLink></MuiLink>)
}

export default function Header() {
  const [golink, setGolink] = React.useState<Link | null>(null);
  const [linkAnchorEl, setLinkAnchorEl] = React.useState<null | HTMLElement>(null);
  const tokenExternalLink = 'https://atlassian.bl.ink/manage/profile';
  const linkPopverOpen = Boolean(linkAnchorEl);

  const loadCurrentGolink = () => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: 'QUERY_GOLINK',
    //   },
    //   (response) => {
    //     setGolink(response.golink);
    //   },
    // );
  };

  const handleClickLink = (event: React.MouseEvent<any>) => {
    if (golink) {
      setLinkAnchorEl(event.currentTarget);
      navigator.clipboard.writeText(golink.url || '');
      // close popover after 1 second
      setTimeout(() => {
        setLinkAnchorEl(null);
      }, 1000);
    }
  };

  React.useEffect(() => {
    loadCurrentGolink();
  }, []);

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <img src={logo} alt="logo" style={{ width: '200px' }} />
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        Go Chrome Extension
      </Typography>
      <Typography variant="body2" color="text.secondary" marginTop={1}>
        Please type 'g' in the address bar and press space button to trigger suggestions. Auto update is not supported
        yet. Refresh token can be found from <ExternalLink title="here" link={tokenExternalLink} />
      </Typography>
      {golink && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Typography color="text.primary" sx={{ fontWeight: 'Medium' }}>
            This page has a golink:
          </Typography>
          <Popover
            open={linkPopverOpen}
            onClose={() => setLinkAnchorEl(null)}
            anchorEl={linkAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography color="initial" sx={{ p: 2 }}>
              Link copied!
            </Typography>
          </Popover>
          <MuiLink
            href={golink.short_link}
            sx={{ fontSize: 26, color: '#0052CC' }}
            underline="none"
            onClick={handleClickLink}
          >
            go/{golink.alias}
          </MuiLink>{' '}
        </Stack>
      )}
    </Stack>
  );
}
