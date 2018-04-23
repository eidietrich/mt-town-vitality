/* DistrictMap.jsx

Component to render a specified location inside a geographic district.

Inputs:
 - props.lnglat --> [lng, lat] coordinate pair of interest point
 - props.districtFeature --> single geojson-format district feature to plot on map
 - props.districtType --> string label for district type being mapped (e.g. 'House district')
 - props.districtName --> string id for district (e.g. 'House District 4')
 - props.districts --> geojson FeatureCollection of all districts in current layer

Outputs:
 - Render container with district information and map with boundary and interest point plotted

NOTES/POSSIBLE GOTCHAS:
- Depending on input library requirements, props.districtShape may or may not be appropriate format. Check whether library expects a geojson {type: "Feature"} or {type: "FeatureCollection"} (props.districtShape is supplied as {type: "Feature" currently})
- Some geomapping systems assume [lat, lng] for coordinates, others [lng, lat]. Make sure props.latlng is in the order the mapping library expects.

*/

import React from 'react';

import ReactMapGL, { SVGOverlay } from 'react-map-gl'

import './../css/mapbox-gl.css';

const mapAspect = 0.65;

const markerShape = "M0-18.9c-2.6,0-4.7,2.1-4.7,4.7c0,0.9,1.1,3.6,1.7,5.3L0,0l3-8.9c0,0,1.7-4.2,1.7-5.3C4.7-16.8,2.6-18.9,0-18.9z M0-12.6c-0.9,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S0.9-12.6,0-12.6z";



export default class DistrictMap extends React.Component {

  componentDidMount(){
    window.addEventListener('resize', this._setSize.bind(this));
    this._setSize();
  }

  componentWillUnmount(){
    console.log('unmounting map');
    window.removeEventListener('resize', this._setSize.bind(this));
  }

  _setSize(){
    // adjusts map display width to match container width
    let { clientHeight, clientWidth } = this.refs['map-container']

    this.props.setViewport({
      width: clientWidth,
      height: clientWidth * mapAspect,
    })
  }

  _onViewportChange(newViewport){
    this.props.setViewport(newViewport)
  }

  _onClick(event){
    const latlng = event.lngLat;
    this.props.handleMapPointSelect({
      lnglat: latlng,
    })
  }

  // _onHover(event){
  //   const features = event.features;
  //   this.props.handleMapHover(features)
  // }

  /* Render methods */

  render(){

    const focusTown = this.props.townFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.townFeature, 'map-highlight town')
      }} />
    ) : null ;

    const focusSchool = this.props.schoolFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.schoolFeature, 'map-highlight school')
      }} />
    ) : null ;

    const focusCounty = this.props.countyFeature ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildShape(opt, this.props.countyFeature, 'map-highlight county')
      }} />
    ) : null ;

    // const focusTown = null;
    // const focusSchool = null;
    // const focusCounty = null;

    const markerOverlay = this.props.lnglat ? (
      <SVGOverlay redraw={(opt) => {
        return this.buildMarker(opt, this.props.lnglat)
      }} />
    ) : null;

    return (
      <div className='map-container' ref='map-container'>
        <ReactMapGL
          {...this.props.viewport}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.props.style}
          onViewportChange={this._onViewportChange.bind(this)}
          onClick={this._onClick.bind(this)}
        >
          {focusCounty}
          {focusSchool}
          {focusTown}
          {markerOverlay}
        </ReactMapGL>
      </div>
    );
  }


  buildShape(opt, feature, className){
    const isMulti = feature.geometry.type === 'MultiPolygon'
    // Possible TODO - set up data import scripts so all shapes are multipolygons
    // OR refactor this

    if (!isMulti) {
      const coordinates = feature.geometry.coordinates;
      const pathCoords = coordinates[0].map(coord => opt.project(coord))
      const d = 'M' + pathCoords.join(" ")
      return (<g key={feature.properties.id}><path className={className} d={d} /></g>);
    } else {
      const coordinates = feature.geometry.coordinates;
      const paths = coordinates.map((shape, i) => {
        const pathCoords = shape[0].map(coord => {
          const projected = opt.project(coord)
          return projected;
        })
        const d = 'M' + pathCoords.join(" ")
        return (<path className={className} d={d} key={String(i)} />);
      })
      return (<g key={feature.properties.id}>
        {paths}
      </g>);
    }


  }

  buildMarker(opt, lnglat){
    const p = opt.project([lnglat[0], lnglat[1]]);
    return (
      <g transform={'translate(' + p[0] + ',' + p[1] + '), scale(1)'}>
        <circle
          className='point-marker-icon-shadow'
          cx={0} cy={0} r={8}
          transform='scale(1,0.5)' />
        <path
          className='point-marker-icon'
          transform='scale(2)'
          d={markerShape}/>
      </g>
    );
  }

//   /* Interaction handlers */

//   // zoomToStreetLevel(){
//   //   this._setViewport({
//   //     zoom: 14,
//   //     latitude: this.props.lnglat[1],
//   //     longitude: this.props.lnglat[0],
//   //   })
//   // }

//   zoomToFit(){
//     this._setBounds(this.props.districtFeature);
//   }
}
