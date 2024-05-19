import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="alert-show-map"
export default class extends Controller {
  static values = {
    apiKey: String,
    marker: Object,
  };
  connect() {
    console.log(this.markerValue)
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10",
    });

    // Add marker to map
    this.#addMarkerToMap();
    this.#fitMapToMarker();
  }

  #addMarkerToMap() {
    let mark = this.markerValue;
    mark = new mapboxgl.Marker({color: '#FF4A4A'})
      .setLngLat([mark.lng, mark.lat])
      .addTo(this.map);
  }

  #fitMapToMarker() {
    let mark = this.markerValue;
    this.map.jumpTo({
      center: [mark.lng, mark.lat],
      zoom: 16,
    });
  }
}
