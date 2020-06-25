import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Constants from './../utilities/Constants';
import {Rating} from 'react-native-ratings';
import Loader from './../utilities/Loader';

import {
  getFaivoriteMovies,
  searchMovies,
  modifyFavorMovie,
} from '../utilities/ApiProvider';
import Styles from './Styles';

class SecondScreen extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.SECONDARY_TITLE,
    headerRight: <View />,
  };

  state = {
    movieDetails: {}, // contain details about the chosen movie
    favoriateMovies: [], //contain all favoriate movies
    isShowFavoriateMovies: false, //boolean variable will show the favoriate movies if true
    searchText: '', //search content
    moviesSearchResults: [], //contain array of movies from search
    isValidSearch: true, //check if the search input is valid
    isLoading: true, //boolean variable ,will show spinner if true
  };

  async componentDidMount() {
    let {navigation} = this.props;
    let movieDetails = navigation.getParam('movie');
    try {
      let data = await getFaivoriteMovies();
      let favoriateMovies = data.results;
      this.setState({movieDetails, favoriateMovies, isLoading: false});
    } catch (err) {
      this.setState({movieDetails, isLoading: false});
    }
  }

  handleIsShowFavoriateMovies() {
    let {isShowFavoriateMovies} = this.state;
    this.setState({isShowFavoriateMovies: !isShowFavoriateMovies});
  }
  //search movies by searchText variable
  async handleSearchMovie() {
    try {
      let {searchText} = this.state;
      if (searchText.length) {
        let moviesSearchResults = await searchMovies(searchText);
        this.setState({
          moviesSearchResults,
          isValidSearch: true,
          isLoading: false,
        });
      } else throw new Error();
    } catch (err) {
      this.setState({isValidSearch: false, isLoading: false});
    }
  }

  //change movie favorite property
  modifyFavoriate = async moviId => {
    try {
      let favorite = this.isFavorite(moviId) === 1 ? false : true;
      await modifyFavorMovie(moviId, favorite);
      let data = await getFaivoriteMovies();
      let favoriateMovies = data.results;
      this.setState({favoriateMovies, isLoading: false});
    } catch (err) {
      this.setState({isLoading: false});
    }
  };

  //check the status of favorite property
  isFavorite = movieId => {
    let {favoriateMovies} = this.state;
    if (!favoriateMovies || favoriateMovies.length === 0) return 0;
    for (let movie of favoriateMovies) {
      if (movie.id === movieId) return 1;
    }
    return 0;
  };

  render() {
    let {
      movieDetails,
      favoriateMovies,
      isShowFavoriateMovies,
      moviesSearchResults,
      searchText,
      isValidSearch,
    } = this.state;

    return (
      <View style={{backgroundColor: Constants.Colors.Grey}}>
        {this.state.isLoading ? (
          <Loader show={true} loading={this.state.isLoading} />
        ) : null}
        <StatusBar
          backgroundColor={Constants.Colors.black}
          barStyle="light-content"
        />

        <ScrollView
          style={Styles.movieCard}
          showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={Styles.image}
              source={{
                uri: Constants.URL.IMAGE_URL + movieDetails.poster_path,
              }}
            />
            <Text style={{fontSize: 16, margin: 5, fontWeight: 'bold'}}>
              {movieDetails.original_title}
            </Text>
          </View>

          <View style={{flexDirection: 'row', margin: 10}}>
            <Text style={{flex: 0.5}}>{Constants.Strings.RATINGS}</Text>
            <Text style={{flex: 0.5}}>
              {movieDetails.vote_average}
              /10
            </Text>
          </View>

          <View style={{margin: 10}}>
            <Text style={{flex: 0.2}}>{Constants.Strings.OVERVIEW}</Text>
          </View>
          <View style={{margin: 10}}>
            <Text style={{flexWrap: 'wrap', flex: 0.8}}>
              {movieDetails.overview}
            </Text>
          </View>
          <View style={{margin: 10}}>
            <TouchableOpacity
              onPress={() => this.handleIsShowFavoriateMovies()}
              style={Styles.buttonContainer}>
              <Text style={Styles.buttonText}>
                {Constants.Strings.FAVORIATE_LIST_BUTTON}
              </Text>
            </TouchableOpacity>
          </View>

          {isShowFavoriateMovies &&
          favoriateMovies &&
          favoriateMovies.length ? (
            <ScrollView
              style={Styles.movieList}
              showsVerticalScrollIndicator={false}>
              <View>
                {favoriateMovies.map(function(movie, i) {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('SecondScreen', {
                          movie,
                        })
                      }
                      key={i}
                      style={{margin: 10, marginBottom: 5}}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          style={Styles.imageFavoriate}
                          source={{
                            uri: Constants.URL.IMAGE_URL + movie.poster_path,
                          }}
                        />
                        <View
                          style={{
                            flexDirection: 'column',
                          }}>
                          <Text numberOfLines={1} style={{fontSize: 17}}>
                            {movie.original_title}
                          </Text>
                          <View style={Styles.rowView}>
                            <Text numberOfLines={1}>
                              {Constants.Strings.RELEASE_DATE}
                            </Text>
                            <Text numberOfLines={1}>{movie.release_date}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={Styles.lineView} />
                    </TouchableOpacity>
                  );
                }, this)}
              </View>
            </ScrollView>
          ) : null}

          <View style={{backgroundColor: Constants.Colors.Grey}}>
            <View style={Styles.cardView}>
              <View style={{margin: 10}}>
                <Text style={{fontSize: 16, margin: 5, fontWeight: 'bold'}}>
                  {Constants.Strings.SEARCH_TTITLE}
                </Text>
                <View style={{backgroundColor: Constants.Colors.White}}>
                  <View style={Styles.cardView}>
                    {!isValidSearch ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 10,
                          color: 'red',
                        }}>
                        {Constants.Strings.INVALID_INPUT}
                      </Text>
                    ) : null}
                    <View style={{margin: 10}}>
                      <TextInput
                        placeholder={Constants.Strings.PLACEHOLDER}
                        value={searchText}
                        onChangeText={searchText => this.setState({searchText})}
                        underlineColorAndroid={Constants.Colors.Transparent}
                      />
                      <View
                        style={{
                          height: 1,
                          backgroundColor: Constants.Colors.Grey,
                          margin: 0,
                        }}
                      />
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({isLoading: true}, () =>
                            this.handleSearchMovie(),
                          )
                        }
                        style={Styles.buttonContainer}>
                        <Text style={Styles.buttonText}>
                          {Constants.Strings.SEARCH_BUTTON}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {moviesSearchResults && moviesSearchResults.length ? (
                      <ScrollView
                        style={Styles.movieList}
                        showsVerticalScrollIndicator={false}>
                        <View>
                          {moviesSearchResults.map(function(movie, i) {
                            return (
                              <View
                                key={i}
                                style={{margin: 10, marginBottom: 5}}>
                                <View style={{flexDirection: 'row'}}>
                                  <Image
                                    style={Styles.imageFavoriate}
                                    source={{
                                      uri:
                                        Constants.URL.IMAGE_URL +
                                        movie.poster_path,
                                    }}
                                  />
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      style={{fontSize: 17}}>
                                      {movie.original_title}
                                    </Text>
                                    <View style={Styles.rowView}>
                                      <Text numberOfLines={1}>
                                        {Constants.Strings.RELEASE_DATE}
                                      </Text>
                                      <Text numberOfLines={1}>
                                        {movie.release_date}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        position: 'absolute',
                                        top: 60,
                                      }}>
                                      <Rating
                                        type="heart"
                                        ratingCount={1}
                                        imageSize={40}
                                        startingValue={this.isFavorite(
                                          movie.id,
                                        )}
                                        onFinishRating={() =>
                                          this.setState({isLoading: true}, () =>
                                            this.modifyFavoriate(movie.id),
                                          )
                                        }
                                      />
                                    </View>
                                  </View>
                                </View>
                                <View style={Styles.lineView} />
                              </View>
                            );
                          }, this)}
                        </View>
                      </ScrollView>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default SecondScreen;
