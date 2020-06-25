import {URL, Strings} from './Constants';
import axios from 'axios';

function buildUrl(url) {
  return `${URL.BASE_URL}${url}?${URL.API_KEY}`;
}

//get token
async function getRequestToken(page = 1) {
  const {
    data: {request_token},
  } = await axios.get(`${buildUrl('authentication/token/new')}&page=${page}`);
  return request_token;
}
//check validate of token and user details
async function validateToken(request_token, username, password) {
  await axios.post(buildUrl('authentication/token/validate_with_login'), {
    request_token,
    username,
    password,
  });
}
//create new session
async function createSession(request_token) {
  const {
    data: {session_id},
  } = await axios.post(buildUrl('authentication/session/new'), {
    request_token,
  });
  return session_id;
}
//get account details from sessionId
async function getAccountDetails(sessionId) {
  const {
    data: {id: accountId},
  } = await axios.get(buildUrl('account'), {
    params: {session_id: sessionId},
  });
  return accountId;
}

//get favorite movies
export async function getFaivoriteMovies(page = 1) {
  const username = Strings.USER_NAME;
  const password = Strings.PASSWORD;
  try {
    let request_token = await getRequestToken(page);
    await validateToken(request_token, username, password);
    let session_id = await createSession(request_token);
    let accountId = await getAccountDetails(session_id);

    let favoriteMovies = await axios.get(
      `${buildUrl(
        `account/${accountId}/favorite/movies`,
      )}&session_id=${session_id}&page=${page}`,
    );
    return favoriteMovies.data;
  } catch (error) {}
}

//modify favoriate properity to specific movie
export async function modifyFavorMovie(movieId, favorite) {
  const username = Strings.USER_NAME;
  const password = Strings.PASSWORD;
  try {
    let request_token = await getRequestToken();
    await validateToken(request_token, username, password);
    let session_id = await createSession(request_token);
    let accountId = await getAccountDetails(session_id);
    await axios.post(
      `${buildUrl(`account/${accountId}/favorite`)}&session_id=${session_id}`,
      {media_type: 'movie', media_id: movieId, favorite},
    );
  } catch (error) {}
}

//get popular movies
export async function getPopularMovies(page = 1) {
  try {
    const {
      data: {results: popularMovies},
    } = await axios.get(
      `${buildUrl('movie/popular')}&language=en-US&page=${page}`,
    );
    return popularMovies;
  } catch (err) {
    throw new Error(err);
  }
}

//search movies by specific text
export async function searchMovies(query, page = 1) {
  try {
    const {
      data: {results: movies},
    } = await axios.get(
      `${buildUrl('search/movie')}&page=${page}&query=${query}`,
    );
    return movies;
  } catch (err) {}
}
