import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {getPopularMovies} from '../utilities/ApiProvider';
import Constants from './../utilities/Constants';
import Loader from './../utilities/Loader';

import Styles from './Styles';

class MainScreen extends Component {
  static navigationOptions = {
    headerTitle: Constants.Strings.MAIN_TITLE,
  };
  state = {
    movieList: [], // movie list
    noData: false, // If there are no movies will display a message
    page: 1, //
    isLoading: false, //boolean variable ,will show spinner if true
  };

  //get the popular movies
  async handleGetPopularMovies() {
    let {page} = this.state;
    getPopularMovies(page)
      .then(movieList => {
        console.log('movieList', movieList);
        this.setState({movieList, isLoading: false});
      })
      .catch(err => {
        this.setState({noData: true, isLoading: false});
      });
  }

  render() {
    let {noData, movieList, page} = this.state;
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading ? (
          <Loader show={true} loading={this.state.isLoading} />
        ) : null}
        <StatusBar
          backgroundColor={Constants.Colors.black}
          barStyle="light-content"
        />
        <View style={{backgroundColor: Constants.Colors.Grey}}>
          <View style={Styles.cardView}>
            <View style={{margin: 10}}>
              <View
                style={{
                  height: 1,
                  backgroundColor: Constants.Colors.Grey,
                  margin: 0,
                }}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({isLoading: true}, () =>
                    this.handleGetPopularMovies(),
                  )
                }
                style={Styles.buttonContainer}>
                <Text style={Styles.buttonText}>
                  {Constants.Strings.MOVIES_LIST_BUTTON}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {noData ? (
          <Text style={{textAlign: 'center'}}>
            {Constants.Strings.NO_DATA_FOUND}
          </Text>
        ) : null}
        {movieList && movieList.length ? (
          <ScrollView
            style={Styles.movieList}
            showsVerticalScrollIndicator={false}>
            <View>
              {movieList.map(function(movie, i) {
                console.log('printmovie', JSON.stringify(movie));
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
                        style={Styles.image}
                        source={{
                          uri: Constants.URL.IMAGE_URL + movie.poster_path,
                        }}
                      />
                      <View style={{flexDirection: 'column'}}>
                        <Text numberOfLines={1} style={{fontSize: 17}}>
                          {movie.original_title}
                        </Text>
                        <View style={Styles.rowView}>
                          <Text>{Constants.Strings.RELEASE_DATE}</Text>
                          <Text>{movie.release_date}</Text>
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
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              let nPage = page - 1 < 1 ? 1 : page - 1;
              this.setState({isLoading: true, page: nPage}, () =>
                this.handleGetPopularMovies(),
              );
            }}
            style={Styles.buttonContainer}>
            <Text style={Styles.buttonText}>{Constants.Strings.BACK_PAGE}</Text>
          </TouchableOpacity>
          <View style={{marginLeft: 10}} />

          <TouchableOpacity
            onPress={() => {
              let nPage = page + 1;
              this.setState({isLoading: true, page: nPage}, () =>
                this.handleGetPopularMovies(),
              );
            }}
            style={Styles.buttonContainer}>
            <Text style={Styles.buttonText}>{Constants.Strings.NEXT_PAGE}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MainScreen;
