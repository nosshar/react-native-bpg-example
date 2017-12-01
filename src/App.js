'use strict';

import React from 'react';
import {AppRegistry, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import BPG from 'react-native-bpg';

class BPGExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      listOfBPG: [],
      imageBase64Message: null,
      imageBase64: null,
      imageBase64Width: null,
      imageBase64Height: null
    };
  }

  componentWillMount() {
    BPG.getList(
      'contents',
      (path) => {
        console.info(`Error reading path ${path}`);
      },
      (listOfBPG) => {
        listOfBPG.forEach(bpg => this.state.listOfBPG.push(bpg));
        this.setState(this.state);
      });
  }

  _load(image) {
    BPG.getJpegFromBPG(
      'contents/' + image,
      50,
      (image) => {
        console.info(`Error obtaining image ${image}`);
      },
      (message, imageBase64, imageBase64Width, imageBase64Height) => {
        this.state.imageBase64Message = message;
        this.state.imageBase64 = imageBase64;
        const aspectRatio = imageBase64Width / imageBase64Height;
        const {width} = Dimensions.get('window');
        this.state.imageBase64Width = width;
        this.state.imageBase64Height = width / aspectRatio;
        this.setState(this.state);
      });
  }

  render() {
    return (
      <View>
        <Text>Test</Text>
        {this.state.imageBase64 && (
          <Image source={{uri: this.state.imageBase64}}
                 width={this.state.imageBase64Width}
                 height={this.state.imageBase64Height}
                 style={{
                   width: this.state.imageBase64Width,
                   height: this.state.imageBase64Height
                 }}
          />
        )}
        {this.state.imageBase64Message && <Text>{this.state.imageBase64Message}</Text>}

        {this.state.listOfBPG.map((bpg, bpgIndex) => (
          <TouchableOpacity key={bpgIndex}
                            onPress={() => {
                              this._load(bpg);
                            }}>
            <Text>{bpg}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

AppRegistry.registerComponent('BPGExample', () => BPGExample);
