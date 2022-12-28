import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/posts.js';
import { createPost } from '../store/posts.js';
import { fetchUsers } from '../store/users.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Typography from '@mui/material/Typography';
import auth from '../store/auth.js';

// const formatDate = (createdAt) => {
//   const date = new Date(createdAT);
//   const formattedDate = createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//   return formattedDate
// }

const Post = () => {
  let createdAT = ''
    const { posts, users, auth } = useSelector(state => state)
    const dispatch = useDispatch();
    const [userPost, setUserPost] = useState({
        text: "",
        userId: auth.id,
        feeling: "",
    });

    useEffect(()=> {
        dispatch(fetchPosts());
        dispatch(fetchUsers());
    }, []);

    const [error, setError] = useState({});

    const submitPost = async (ev) => {
        ev.preventDefault();
        try {
            await dispatch(createPost(userPost));
            setUserPost({
                text: "",
                userId: auth.id,
                feeling: "",
            });
            setError({});
        }
        catch(err) {
            setError(err.response.data);
        }
    }

    let errorMessages = [];

	if (error.errors) {
		errorMessages = error.errors.map((err) => err.message);
	}

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
          color: theme.palette.action.disabled,
        },
      }));
      
      const customIcons = {
        1: {
          icon: <SentimentVeryDissatisfiedIcon color="error" />,
          label: 'Very Dissatisfied',
        },
        2: {
          icon: <SentimentDissatisfiedIcon color="error" />,
          label: 'Dissatisfied',
        },
        3: {
          icon: <SentimentSatisfiedIcon color="warning" />,
          label: 'Neutral',
        },
        4: {
          icon: <SentimentSatisfiedAltIcon color="success" />,
          label: 'Satisfied',
        },
        5: {
          icon: <SentimentVerySatisfiedIcon color="success" />,
          label: 'Very Satisfied',
        },
      };
      
      const findReaction = (rating) => {
        if (rating) {
          return customIcons[rating].icon;
        }
      }
      
      function IconContainer(props) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
      }
      
      IconContainer.propTypes = {
        value: PropTypes.number.isRequired,
      };

      const formatDate = (createdAt) => {
        const date = new Date(createdAT);
        const formattedDate = createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return formattedDate
      }

  return (
    <div>
      <Box component="span" sx={{ p: 2, border: '' }}>
        <div>
            <form onSubmit={submitPost}>
            <InputLabel htmlFor="filled-textarea">Create New Post:</InputLabel>
            <TextField
                id="filled-textarea"
                label="Text here.."
                placeholder="Begin.."
                multiline
                rows={7}
                variant="filled"
                defaultValue={userPost.text}
				        onChange={(ev) => setUserPost({ ...userPost, text: ev.target.value })}
            />
            <Typography component="legend">Feeling</Typography>
            <StyledRating
                name="highlight-selected-only"
                defaultValue={2}
                value={userPost.feeling}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => customIcons[value].label}
                highlightSelectedOnly
                onChange={(ev) => setUserPost({ ...userPost, feeling: ev.target.value })}
            />
            <Button onClick={submitPost}>Submit</Button>
            </form>
        </div>
        <br></br>
        <div className="posts-thread">
          <Grid sx={{overflowY: "scroll", overflow: "hidden", }}>
            <Box>
                {
                    posts.map((post) => {
                      const currUser = users.filter(currUser => currUser.id === post.userId);
                      const allUsers = currUser.map(person => {return [`${person.firstName} ${person.lastName}`]});
                        return ([
                          <Box sx={{ m: 3 }}>
                            <Grid item key={post.id}>
                              <Card key={post.id}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse'}}><Typography>{ formatDate(`${post.createdAt}`) }</Typography></Box>
                                    <Box sx={{height: 50, color: 'primary.main'}}><Typography>{ allUsers }</Typography></Box>
                                    <Box><Typography>{ findReaction(post.feeling) }</Typography></Box>
                                    <Box sx={{height: 40}}><Typography>{ post.text }</Typography></Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Box>
                        ].sort())
                    })
                }
            </Box>
            </Grid>
        </div>
      </Box>
    </div>
  );
}

export default Post