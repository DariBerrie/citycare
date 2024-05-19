import { Controller } from "@hotwired/stimulus"

const COUNTRIES = "fr";

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    alerts: Array
  }
  static targets = ["map", "geocoder", "alertsContainer", "alertsHeading", "alertPath", "listingTemplate"]

  connect() {
    console.log("Map controller connected.");

    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10"
    });

    this.addMarkersToMap();
    this.fitMapToMarkers();
    this.geocoderSearch();
  }

  addMarkersToMap() {
    this.markersValue.forEach(marker => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window);
      new mapboxgl.Marker({color: "#FF4A4A"})
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }

  geocoderSearch() {
    const geocoder = new MapboxGeocoder({ 
      accessToken: mapboxgl.accessToken,
      countries: COUNTRIES,
      mapboxgl: mapboxgl 
    });

    geocoder.options.placeholder = "Enter your address";

    if (!document.querySelector('.mapboxgl-ctrl-geocoder')) {
      this.geocoderTarget.appendChild(geocoder.onAdd(this.map));
    }

    geocoder.on("result", event => {
      sessionStorage.setItem("addressEvent", event.result.place_name);
      const searchResult = event.result.geometry;
      const alerts = this.calculateAlertDistances(searchResult);
      this.updateAlertsList(alerts);
      this.fitMapToAlerts(alerts, searchResult);
    });
  }

  calculateAlertDistances(searchResult) {
    const options = { units: "kilometers" };
    const alerts = this.alertsValue;

    alerts.forEach(alert => {
      alert.distance = turf.distance(
        searchResult,
        turf.point([alert.longitude, alert.latitude]),
        options
      );
    });

    return alerts.filter(alert => alert.distance <= 2).sort((a, b) => a.distance - b.distance);
  }

  updateAlertsList(alerts) {
    this.alertsContainerTarget.innerHTML = "";
    this.alertsHeadingTarget.innerText = "Alerts in this area";
    alerts.forEach(alert => this.alertsContainerTarget.appendChild(this.renderAlert(alert)));
  }

  renderAlert(alert) {
    const clone = this.listingTemplateTarget.content.cloneNode(true);
    clone.querySelector("img").src = alert.photos[0].url;
    clone.querySelector("a").href = `${this.alertPathTarget.value}/${alert.id}`;
    clone.querySelector("a").textContent = alert.address;
    clone.querySelector("span.title").textContent = alert.title;
    clone.querySelector("p.description").textContent = alert.description;
    clone.querySelector("span.distance").textContent = `${(alert.distance).toFixed(2)} kms away`;
    return clone;
  }

  fitMapToAlerts(alerts, searchResult) {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([searchResult.coordinates[0], searchResult.coordinates[1]]);
    alerts.forEach(alert => bounds.extend([alert.longitude, alert.latitude]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 700 });
  }
}