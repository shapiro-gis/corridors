function openPopup() {
    window.location.hash = 'openModal';
  }
  
  window.onload = openPopup;


require(["esri/Map", "esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/BasemapToggle", "esri/widgets/LayerList",
"esri/widgets/Home"], 
(Map, MapView,FeatureLayer, BasemapToggle,LayerList, Home) => {
    const map = new Map({
      basemap: "topo-vector"
    });

    const view = new MapView({
      container: "map",
      map: map,
      zoom: 7,
      center:[-111, 39]
    });
    const homeBtn = new Home({
        view: view
      });
    
      // Add the home button to the top left corner of the view
      view.ui.add(homeBtn, "top-left");

    const toggle = new BasemapToggle({
        // 2 - Set properties
        view: view, // view that provides access to the map's 'topo-vector' basemap
        nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
      });
      view.ui.add(toggle, "top-left");

      const template = {
        title: "{area_name}: {migratType}",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "CollarGPS",
                label: "GPS Collars Sampled"
            },
        {
            fieldName:"HerdSize",
            label: "Herd Size"
        },
        {
            fieldName:"Species",
            label:"Species"
        }]

        }]

    };
    const featureLayer = new FeatureLayer({
        url:"https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/migration_corridors/FeatureServer",
          popupTemplate: template

    });
    const stopover = new FeatureLayer({
        url:"https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Stopovers_2021/FeatureServer",
    visible: false
    });

 map.add(featureLayer);
 map.add(stopover)


 
 view.when(function(){
    view.goTo({
        center: [-111,39],
        zoom: 6
    });
})
.catch(function(err){
    console.error("MapView rejected:", err);
});

const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type != "group") {
        // don't show legend twice
        item.panel = {
          content: "legend",
          open: true
        };
      }
    }
  },"text");



  });

