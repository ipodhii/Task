import {StyleSheet} from 'react-native';

export default Styles = StyleSheet.create({
  movieCard: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'white',
    elevation: 10,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#02ADAD',
    width: 'auto',
    borderRadius: 10,
  },
  movieList: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    elevation: 10,
  },
  lineView: {height: 2, marginTop: 10, backgroundColor: '#EDEDED'},

  image: {width: 160, height: 220, marginLeft: 5, margin: 20},
  imageFavoriate: {width: 120, height: 180, marginLeft: 5, marginRight: 20},

  rowView: {flexDirection: 'row', marginTop: 10},

  buttonText: {color: 'white', margin: 5, alignSelf: 'center'},
});
