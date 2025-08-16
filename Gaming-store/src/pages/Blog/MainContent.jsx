import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';

const cardData = [
  {
    img: '/assets/images/blog-1.jpg',
    tag: 'Gaming News',
    title: 'Top 10 Most Anticipated Games of 2025',
    description:
      'Discover the most exciting upcoming games that will dominate the gaming scene in 2025. From AAA blockbusters to indie gems, here are the titles every gamer should watch.',
    authors: [
      { name: 'Alex Chen', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 15, 2025',
  },
  {
    img: '/assets/images/blog-2.jpg',
    tag: 'Reviews',
    title: 'Cyberpunk 2077 Phantom Liberty: A Redemption Story',
    description:
      'After a rocky launch, Cyberpunk 2077 has evolved into the game we all hoped for. Our comprehensive review of the Phantom Liberty expansion reveals a masterpiece in the making.',
    authors: [
      { name: 'Sarah Johnson', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 12, 2025',
  },
  {
    img: '/assets/images/blog-3.jpg',
    tag: 'Hardware',
    title: 'Building the Ultimate Gaming Setup on a Budget',
    description:
      'You don\'t need to break the bank to build an incredible gaming setup. Our guide shows you how to maximize performance while keeping costs low.',
    authors: [
      { name: 'Mike Rodriguez', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 10, 2025',
  },
  {
    img: '/assets/images/featured-game-1.jpg',
    tag: 'Esports',
    title: 'The Rise of Mobile Gaming in Competitive Esports',
    description:
      'Mobile gaming is no longer just casual entertainment. Explore how mobile esports is reshaping the competitive gaming landscape and attracting millions of viewers worldwide.',
    authors: [
      { name: 'Emma Davis', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 8, 2025',
  },
  {
    img: '/assets/images/featured-game-2.jpg',
    tag: 'Industry',
    title: 'Game Development in 2025: AI and the Future of Gaming',
    description:
      'Artificial Intelligence is revolutionizing game development. Learn how AI is being used to create more immersive worlds, smarter NPCs, and personalized gaming experiences.',
    authors: [
      { name: 'David Kim', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 5, 2025',
  },
  {
    img: '/assets/images/featured-game-3.jpg',
    tag: 'Community',
    title: 'Building Gaming Communities: From Discord to Global Events',
    description:
      'The gaming community has never been stronger. Discover how online platforms and real-world events are bringing gamers together across the globe.',
    authors: [
      { name: 'Lisa Park', avatar: '/assets/images/featured-game-icon.png' },
    ],
    date: 'January 3, 2025',
  },
];

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <Avatar
          key={authors[0].name}
          alt={authors[0].name}
          src={authors[0].avatar}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="caption">
          {authors[0].name}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Gaming Blog
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: { sm: '100%', md: '70%' } }}>
          Stay up to date with the latest gaming news, reviews, and insights from our expert team. 
          Discover new games, learn about the industry, and connect with the gaming community.
        </Typography>
      </div>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Chip onClick={() => {}} size="medium" label="All categories" />
          <Chip
            onClick={() => {}}
            size="medium"
            label="Gaming News"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={() => {}}
            size="medium"
            label="Reviews"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={() => {}}
            size="medium"
            label="Hardware"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={() => {}}
            size="medium"
            label="Esports"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Search />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(0)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[0].img}
              sx={{
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[0].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[0].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {cardData[0].description}
              </Typography>
            </SyledCardContent>
            <Author authors={cardData[0].authors} />
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(1)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[1].img}
              sx={{
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[1].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[1].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {cardData[1].description}
              </Typography>
            </SyledCardContent>
            <Author authors={cardData[1].authors} />
          </SyledCard>
        </Grid>
        {cardData.slice(2).map((card, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index + 2}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(index + 2)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === index + 2 ? 'Mui-focused' : ''}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                image={card.img}
                sx={{
                  aspectRatio: '16 / 9',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <SyledCardContent>
                <Typography gutterBottom variant="caption" component="div">
                  {card.tag}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {card.description}
                </Typography>
              </SyledCardContent>
              <Author authors={card.authors} />
            </SyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const SyledCard = Card;
const SyledCardContent = CardContent;

function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}
