import React, { Component } from "react";
import "./App.css";
import Clock from "./Clock";
import MainLogo from "./interface/main_logo.png";
import MainTabList from "./MainTab/MainTabList";
import { Redirect, Route, NavLink } from "react-router-dom";
import { ConnectedRouter as Router } from "react-router-redux";
import { connect } from "react-redux";
import * as actions from "./actions";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

import {
    accomodationNamespace,
    eventNamespace,
    diningNamespace,
    destinationNamespace,
    serviceNamespace,
    mapListNamespace,
    essentialNamespace,
    transportNamespace,
    retailNamespace,
    miningNamespace,
    airportInfoNamespace,
    IDLE_TIME,
    activityNamespace,
    searchResultNamespace
} from "./Constants";
import DestinationList from "./Destination/DestinationList";
import DestinationDetail from "./Destination/DestinationDetail";
import EventList from "./Event/EventList";
import EventDetail from "./Event/EventDetail";
import DiningList from "./Dining/DiningList";
import DiningDetail from "./Dining/DiningDetail";
import HotelList from "./Hotel/HotelList";
import HotelDetail from "./Hotel/HotelDetail";
import ServiceInitialList from "./Service/ServiceInitialList";
import ServiceTypeList from "./Service/ServiceTypeList";
import ServiceList from "./Service/ServiceList";
import ServiceDetail from "./Service/ServiceDetail";
import ActivityList from "./Activity/ActivityList";
import ActivityDestinationList from "./Activity/ActivityDestinationList";
import ActivityDestinationDetail from "./Activity/ActivityDestinationDetail";
import MapList from "./Maps/MapList";
import Advertisement from "./Advertisement/Advertisement";
import idleJS from "idle-js";
import RestComponent from "./RestMode/RestComponent";
import AirportInfo from "./Airport/AirportInfo";
import AirportMapModal from "./Airport/AirportMapModal";
import Search from "./Search/Search";
import SearchResult from "./Search/SearchResult";
import lunr from "lunr";
import { map, isEmpty } from "lodash";
import search_icon from "./interface/SearchIcon.png";

export let idx;

class App extends Component {
    idleRef = null;
    constructor(props) {
        super(props);
        this.state = {
            isIdle: false,
            searchBarEnable: false
        };
        this.setSPAIdle = this.setSPAIdle.bind(this);
        this.setSPAActive = this.setSPAActive.bind(this);
    }
    setSPAIdle() {
        this.setState({ isIdle: true });
        this.props.setShowKeyboard(false);
        this.props.setShowSearchBarBoolean(false);
    }
    setSPAActive() {
        const { isIdle } = this.state;
        if (isIdle) {
            this.setState({ isIdle: false });
        }
    }

    componentDidMount() {
        this.props.fetchDestinationList();
        this.props.fetchEventList();
        this.props.fetchAccommodationList();
        this.props.fetchDiningList();
        this.props.fetchActivityList();
        this.props.fetchEssentialTypeList();
        this.props.fetchMiningTypeList();
        this.props.fetchRetailTypeList();
        this.props.fetchTransportTypeList();
        this.props.fetchMapList();
        this.props.fetchAdVideoList();
        this.props.fetchAdvertisementList();
        this.props.fetchSpecificAdsRestaurantList();
        this.props.fetchSpecificAdsActivityDestinationList();
        this.props.fetchSpecificAdsEssentialList();
        this.props.fetchSpecificAdsMiningList();
        this.props.fetchSpecificAdsRetailList();
        this.props.fetchSpecificAdsTransportList();
        this.props.fetchSpecificAccommodationList();
        this.props.fetchSpecificAdsEventList();
        this.props.fetchFeaturedAdvertisementList();
        this.props.fetchShowcaseAdvertisementList();
        this.props.fetchAirportDetail();

        //Set idle timer
        this.idleRef = new idleJS({
            idle: IDLE_TIME,
            onIdle: this.setSPAIdle,
            onActive: this.setSPAActive
        }).start();
    }

    initialiseSearchEngine() {
        const {
            destinationList,
            accommodationList,
            eventList,
            restaurantList,
            activityList,
            essentialServiceTypeList,
            miningServiceTypeList,
            retailServiceTypeList,
            transportServiceTypeList
        } = this.props;
        let documents = [];

        /*
         * DOCUMENTS FOR DESTINATION
         */
        map(destinationList.destinations, destination => {
            let imagelink;
            if (
                !isEmpty(destination.imageDestination) &&
                destination.imageDestination.length > 0
            ) {
                imagelink = destination.imageDestination[0].imageFile;
            }

            documents.push({
                id: documents.length,
                link: `${destinationNamespace}/${destination.id}`,
                title: destination.title,
                text: `${destination.description} ${destination.airport} ${
                    destination.province
                } destination`,
                image: imagelink,
                data: destination
            });
        });

        /*
         * DOCUMENTS FOR ACCOMMODATION
         */
        map(accommodationList.accommodations, destination => {
            let imagelink;
            if (
                !isEmpty(destination.imageDestination) &&
                destination.imageDestination.length > 0
            ) {
                imagelink = destination.imageDestination[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${accomodationNamespace}/${destination.id} `,
                title: destination.title,
                text: `${destination.title} ${
                    destination.description
                } accommodation hotel`,
                image: imagelink,
                data: destination
            });
            map(destination.accomodationDestination, accommodation => {
                let imagelink;
                if (!isEmpty(accommodation.logo)) {
                    imagelink = accommodation.logo;
                }
                documents.push({
                    id: documents.length,
                    link: `${accomodationNamespace}/${destination.id}/${
                        accommodation.id
                    }`,
                    title: accommodation.title,
                    text: `${accommodation.description} ${
                        accommodation.address
                    }   ${accommodation.phone} ${
                        destination.title
                    } accommodation hotel`,
                    image: imagelink,
                    data: accommodation
                });
            });
        });

        /*
         * DOCUMENTS FOR ACTIVITY
         */
        map(activityList.activities, activity => {
            let imagelink;
            if (
                !isEmpty(activity.imageActivity) &&
                activity.imageActivity.length > 0
            ) {
                imagelink = activity.imageActivity[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${activityNamespace}/${activity.id}
                }`,
                title: activity.title,
                text: `${activity.title} activity`,
                image: imagelink,
                data: activity
            });

            map(activity.activityDestinationActivity, eachActivity => {
                documents.push({
                    id: documents.length,
                    link: `${activityNamespace}/${activity.id}/${
                        eachActivity.id
                    }`,
                    title: eachActivity.title,
                    text: `${activity.title} ${eachActivity.title}   ${
                        eachActivity.description
                    }  activity`,
                    image: imagelink,
                    data: eachActivity
                });

                map(
                    eachActivity.tourActivityDestination,
                    eachTourActivityDestination => {
                        documents.push({
                            id: documents.length,
                            link: `${activityNamespace}/${activity.id}/${
                                eachActivity.id
                            }`,
                            title: eachActivity.title,
                            text: `${activity.title} ${eachActivity.title}   ${
                                eachActivity.description
                            } ${eachTourActivityDestination.title} activity`,
                            image: imagelink,
                            data: eachTourActivityDestination
                        });
                    }
                );
            });
        });

        /*
         * DOCUMENTS FOR EVENT
         */
        map(eventList.events, event => {
            let imagelink;
            if (!isEmpty(event.imageEvent) && event.imageEvent.length > 0) {
                imagelink = event.imageEvent[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${eventNamespace}/${event.id}`,
                title: event.title,
                text: `${event.description} ${event.title} ${
                    event.location
                } event`,
                image: imagelink,
                data: event
            });
        });

        /*
         * DOCUMENTS FOR RESTAURANT
         */
        map(restaurantList.restaurants, restaurant => {
            let imagelink;
            if (
                !isEmpty(restaurant.imageRestaurant) &&
                restaurant.imageRestaurant.length > 0
            ) {
                imagelink = restaurant.imageRestaurant[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${diningNamespace}/${restaurant.id}`,
                title: restaurant.title,
                text: `${restaurant.description} ${restaurant.address} ${
                    restaurant.guide.cuisine
                } restaurant dining`,
                image: imagelink,
                data: restaurant
            });
        });

        /*
         * DOCUMENTS FOR ESSENTIAL SERVICE
         */
        map(essentialServiceTypeList.serviceTypes, serviceType => {
            let imagelink;
            if (
                !isEmpty(serviceType.imageServiceType) &&
                serviceType.imageServiceType.length > 0
            ) {
                imagelink = serviceType.imageServiceType[0].imageFile;
            }

            documents.push({
                id: documents.length,
                link: `${essentialNamespace}/${serviceType.id}`,
                title: serviceType.title,
                text: ` ${serviceType.title} essential service`,
                image: imagelink,
                data: serviceType
            });
            map(serviceType.essentialServiceServiceType, serviceItem => {
                let imagelink;
                if (!isEmpty(serviceItem.logo)) {
                    imagelink = serviceItem.logo;
                }

                documents.push({
                    id: documents.length,
                    link: `${essentialNamespace}/${serviceType.id}/${
                        serviceItem.id
                    }`,
                    title: serviceItem.title,
                    text: `${serviceItem.description} ${
                        serviceType.title
                    } essential service`,
                    image: imagelink,
                    data: serviceItem
                });
            });
        });

        /*
         * DOCUMENTS FOR TRANSPORT SERVICE
         */
        map(transportServiceTypeList.serviceTypes, serviceType => {
            let imagelink;
            if (
                !isEmpty(serviceType.imageServiceType) &&
                serviceType.imageServiceType.length > 0
            ) {
                imagelink = serviceType.imageServiceType[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${transportNamespace}/${serviceType.id}`,
                title: serviceType.title,
                text: ` ${serviceType.title} transport car hire`,
                image: imagelink,

                data: serviceType
            });
            map(serviceType.transportationServiceType, serviceItem => {
                let imagelink;
                if (!isEmpty(serviceItem.logo)) {
                    imagelink = serviceItem.logo;
                }

                documents.push({
                    id: documents.length,
                    link: `${transportNamespace}/${serviceType.id}/${
                        serviceItem.id
                    }`,
                    title: serviceItem.title,
                    text: `${serviceItem.description} ${
                        serviceType.title
                    } transport car hire`,
                    image: imagelink,

                    data: serviceItem
                });
            });
        });

        /*
         * DOCUMENTS FOR MINING SERVICE
         */
        map(miningServiceTypeList.serviceTypes, serviceType => {
            let imagelink;
            if (
                !isEmpty(serviceType.imageServiceType) &&
                serviceType.imageServiceType.length > 0
            ) {
                imagelink = serviceType.imageServiceType[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${miningNamespace}`,
                title: serviceType.title,
                text: ` ${serviceType.title} mining resource`,
                image: imagelink,
                data: serviceType
            });
            map(serviceType.miningServiceType, serviceItem => {
                let imagelink;
                if (!isEmpty(serviceItem.logo)) {
                    imagelink = serviceItem.logo;
                }
                documents.push({
                    id: documents.length,
                    link: `${miningNamespace}/${serviceType.id}/${
                        serviceItem.id
                    }`,
                    title: serviceItem.title,
                    text: `${serviceItem.description} ${
                        serviceType.title
                    } mining resource`,
                    image: imagelink,
                    data: serviceItem
                });
            });
        });

        /*
         * DOCUMENTS FOR RETAIL SERVICE
         */
        map(retailServiceTypeList.serviceTypes, serviceType => {
            let imagelink;
            if (
                !isEmpty(serviceType.imageServiceType) &&
                serviceType.imageServiceType.length > 0
            ) {
                imagelink = serviceType.imageServiceType[0].imageFile;
            }
            documents.push({
                id: documents.length,
                link: `${retailNamespace}`,
                title: serviceType.title,
                text: ` ${serviceType.title} retail service`,
                image: imagelink,
                data: serviceType
            });
            map(serviceType.retailServiceType, serviceItem => {
                let imagelink;
                if (!isEmpty(serviceItem.logo)) {
                    imagelink = serviceItem.logo;
                }
                documents.push({
                    id: documents.length,
                    link: `${retailNamespace}/${serviceType.id}/${
                        serviceItem.id
                    }`,
                    title: serviceItem.title,
                    text: `${serviceItem.description} ${
                        serviceType.title
                    } retail service`,
                    image: imagelink,
                    data: serviceItem
                });
            });
        });
        console.log(documents);

        this.props.setSearchDocuments(documents);

        idx = lunr(function() {
            this.ref("id");
            this.field("title");
            this.field("text");
            documents.forEach(function(doc) {
                this.add(doc);
            }, this);
        });
    }

    render() {
        const { isIdle } = this.state;
        const {
            destinationList,
            accommodationList,
            eventList,
            restaurantList,
            activityList,
            essentialServiceTypeList,
            miningServiceTypeList,
            retailServiceTypeList,
            transportServiceTypeList,
            map,
            airport,
            adVideoList,
            advertisementList,
            specificAdsRestaurantList,
            specificAdsActivityDestinationList,
            specificAdsEssentialList,
            specificAdsMiningList,
            specificAdsRetailList,
            specificAdsTransportList,
            specificAdsAccommodationList,
            specificAdsEventList,
            featuredAdvertisementList,
            showcaseAdvertisementList
        } = this.props;

        if (
            destinationList.status !== 200 ||
            accommodationList.status !== 200 ||
            eventList.status !== 200 ||
            restaurantList.status !== 200 ||
            activityList.status !== 200 ||
            essentialServiceTypeList.status !== 200 ||
            miningServiceTypeList.status !== 200 ||
            retailServiceTypeList.status !== 200 ||
            transportServiceTypeList.status !== 200 ||
            map.status !== 200 ||
            airport.status !== 200 ||
            adVideoList.status !== 200 ||
            advertisementList.status !== 200 ||
            specificAdsRestaurantList.status !== 200 ||
            specificAdsActivityDestinationList.status !== 200 ||
            specificAdsEssentialList.status !== 200 ||
            specificAdsMiningList.status !== 200 ||
            specificAdsRetailList.status !== 200 ||
            specificAdsTransportList.status !== 200 ||
            specificAdsAccommodationList.status !== 200 ||
            specificAdsEventList.status !== 200 ||
            featuredAdvertisementList.status !== 200 ||
            showcaseAdvertisementList.status !== 200
        ) {
            return (
                <div className="loadingContainer">
                    <div className="loading ">
                        <p className="loading--title">Initialising</p>

                        <ReactLoading
                            className="loadingAnimation"
                            type={"bubbles"}
                            color={"#b9dfe3"}
                            height="900"
                            width="393"
                            delay={0}
                        />
                    </div>
                </div>
            );
        } else {
            if (isEmpty(this.props.searchDocuments)) {
                this.initialiseSearchEngine();
            }
            return (
                <Router history={this.props.history} className="App">
                    <div className="App section--rotate--animation">
                        <div
                            style={{
                                width: "100vw",
                                height: "15vh",
                                backgroundImage: `url(${MainLogo})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover"
                            }}
                            onClick={this.setSPAIdle}
                        />
                        <div
                            style={{
                                width: "100vw",
                                height: "3vh",
                                display: "grid",
                                gridTemplateColumns: "53% 47%"
                            }}
                            {...isIdle && { onMouseMove: this.setSPAActive }}
                            {...isIdle && { onTouchStart: this.setSPAActive }}
                        >
                            {!this.props.showSearchBarBoolean.boolean ? (
                                <div
                                    style={{
                                        width: "100vw",
                                        display: "grid",
                                        gridTemplateColumns: "6vw 23.5vw 23.5vw"
                                    }}
                                >
                                    <Link to={searchResultNamespace}>
                                        <div
                                            style={{
                                                backgroundColor:
                                                    "rgb(13,109,121)",
                                                borderStyle:
                                                    "solid solid solid none",
                                                borderWidth: "1px",
                                                borderColor: "rgb(104,199,197)",
                                                height: "100%"
                                            }}
                                            onClick={() => {
                                                this.props.setShowSearchBarBoolean(
                                                    true
                                                );
                                                this.props.setShowKeyboard(
                                                    true
                                                );
                                                this.props.setShowKeyboardOutAnimation(
                                                    false
                                                );
                                                this.props.setShowSearchBarOutAnimation(
                                                    false
                                                );
                                            }}
                                        >
                                            <img
                                                src={search_icon}
                                                style={{
                                                    paddingTop: "5px",
                                                    height: "45px"
                                                }}
                                                alt="search button"
                                            />
                                        </div>
                                    </Link>
                                    <NavLink
                                        activeStyle={{
                                            backgroundColor: "rgb(243,158,49)",
                                            borderStyle:
                                                "solid solid solid none",
                                            borderWidth: "1px",
                                            borderColor: "rgb(104,199,197)"
                                        }}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderStyle:
                                                "solid solid solid none",
                                            borderWidth: "1px",
                                            borderColor: "rgb(104,199,197)",
                                            backgroundColor: "rgb(13,109,121)",
                                            textDecoration: "none",
                                            color: "white",
                                            fontSize: "22px",
                                            fontWeight: 500,
                                            letterSpacing: "1px",
                                            paddingTop: "10px"
                                        }}
                                        to={airportInfoNamespace}
                                        onClick={() => {
                                            this.props.setDisplaySearchResultsBoolean(
                                                false
                                            );
                                        }}
                                    >
                                        AIRPORT INFO
                                    </NavLink>
                                    <AirportMapModal />
                                </div>
                            ) : (
                                <Search />
                            )}

                            <Clock />
                        </div>
                        <div
                            style={{ width: "100vw", height: "8vh" }}
                            {...isIdle && { onMouseMove: this.setSPAActive }}
                            {...isIdle && { onTouchStart: this.setSPAActive }}
                        >
                            <Route component={MainTabList} />
                        </div>
                        <img
                            className="menu--shadow"
                            src={require(`./MainTab/icons/Button-Shadow.png`)}
                            alt="sidebar_logo"
                            width="1080"
                        />
                        {isIdle ? (
                            <div
                                style={{ width: "100%", height: "74vh" }}
                                onMouseMove={this.setSPAActive}
                                onTouchStart={this.setSPAActive}
                            >
                                {this.props.adVideoList.status === 200 &&
                                    this.props.advertisementList.status ===
                                        200 &&
                                    this.props.featuredAdvertisementList
                                        .status === 200 &&
                                    this.props.showcaseAdvertisementList
                                        .status === 200 && <RestComponent />}
                            </div>
                        ) : (
                            <div>
                                <div style={{ width: "100vw", height: "54vh" }}>
                                    <Route
                                        exact
                                        path={destinationNamespace}
                                        component={DestinationList}
                                    />
                                    <Route
                                        exact
                                        path={accomodationNamespace}
                                        component={DestinationList}
                                    />
                                    <Route
                                        exact
                                        path={destinationNamespace + "/:id"}
                                        component={DestinationDetail}
                                    />
                                    <Route
                                        exact
                                        path={accomodationNamespace + "/:id"}
                                        component={HotelList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            accomodationNamespace +
                                            "/:destid/:accoid"
                                        }
                                        component={HotelDetail}
                                    />
                                    <Route
                                        exact
                                        path={eventNamespace}
                                        component={EventList}
                                    />
                                    <Route
                                        exact
                                        path={eventNamespace + "/:id"}
                                        component={EventDetail}
                                    />
                                    <Route
                                        exact
                                        path={diningNamespace}
                                        component={DiningList}
                                    />
                                    <Route
                                        exact
                                        path={diningNamespace + "/:id"}
                                        component={DiningDetail}
                                    />
                                    <Route
                                        exact
                                        path={serviceNamespace}
                                        component={ServiceInitialList}
                                    />
                                    <Route
                                        exact
                                        path={essentialNamespace}
                                        component={ServiceTypeList}
                                    />
                                    <Route
                                        exact
                                        path={essentialNamespace + "/:serid"}
                                        component={ServiceList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            essentialNamespace +
                                            "/:serid/:serid2"
                                        }
                                        component={ServiceDetail}
                                    />
                                    <Route
                                        exact
                                        path={miningNamespace}
                                        component={ServiceTypeList}
                                    />
                                    <Route
                                        exact
                                        path={miningNamespace + "/:serid"}
                                        component={ServiceList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            miningNamespace + "/:serid/:serid2"
                                        }
                                        component={ServiceDetail}
                                    />
                                    <Route
                                        exact
                                        path={retailNamespace}
                                        component={ServiceTypeList}
                                    />
                                    <Route
                                        exact
                                        path={retailNamespace + "/:serid"}
                                        component={ServiceList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            retailNamespace + "/:serid/:serid2"
                                        }
                                        component={ServiceDetail}
                                    />
                                    <Route
                                        exact
                                        path={transportNamespace}
                                        component={ServiceTypeList}
                                    />
                                    <Route
                                        exact
                                        path={transportNamespace + "/:serid"}
                                        component={ServiceList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            transportNamespace +
                                            "/:serid/:serid2"
                                        }
                                        component={ServiceDetail}
                                    />
                                    <Route
                                        exact
                                        path={activityNamespace}
                                        component={ActivityList}
                                    />
                                    <Route
                                        exact
                                        path={activityNamespace + "/:id"}
                                        component={ActivityDestinationList}
                                    />
                                    <Route
                                        exact
                                        path={
                                            activityNamespace + "/:id/:destid"
                                        }
                                        component={ActivityDestinationDetail}
                                    />
                                    <Route
                                        exact
                                        path={mapListNamespace}
                                        component={MapList}
                                    />
                                    <Route
                                        exact
                                        path={airportInfoNamespace}
                                        component={AirportInfo}
                                    />
                                    <Route
                                        exact
                                        path={searchResultNamespace}
                                        component={SearchResult}
                                    />
                                    <Redirect
                                        from="/"
                                        to={destinationNamespace}
                                    />
                                </div>
                                <div
                                    style={{
                                        width: "100vw",
                                        height: "18vh",
                                        zIndex: "99",
                                        position: "relative"
                                    }}
                                >
                                    {!isIdle &&
                                        this.props.adVideoList.status === 200 &&
                                        this.props.advertisementList.status ===
                                            200 &&
                                        this.props
                                            .specificAdsActivityDestinationList
                                            .status === 200 &&
                                        this.props.specificAdsEssentialList
                                            .status === 200 &&
                                        this.props.specificAdsMiningList
                                            .status === 200 &&
                                        this.props.specificAdsRestaurantList
                                            .status === 200 &&
                                        this.props.specificAdsRetailList
                                            .status === 200 &&
                                        this.props.specificAdsTransportList
                                            .status === 200 &&
                                        this.props.specificAdsAccommodationList
                                            .status === 200 &&
                                        this.props.specificAdsEventList
                                            .status === 200 && (
                                            <Route
                                                render={props => (
                                                    <Advertisement
                                                        // continuePlaying={!isIdle}
                                                        continuePlaying={true}
                                                        {...props}
                                                    />
                                                )}
                                            />
                                        )}
                                </div>
                                <div
                                    style={{
                                        width: "100vw",
                                        height: "2vh",
                                        display: "flex",
                                        backgroundColor: "#058c9b",
                                        color: "white",
                                        zIndex: "99",
                                        position: "relative"
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        <span
                                            style={{
                                                marginLeft: 20,
                                                marginRight: 5
                                            }}
                                        >
                                            &copy;
                                        </span>
                                        JBG Hospitality Publications & Supplies{" "}
                                        {new Date().getFullYear()}
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            marginRight: 20
                                        }}
                                    >
                                        WWW.JBG.COM.PG
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Router>
            );
        }
    }
}

function mapStateToProps({
    windowSize,
    adVideoList,
    adVideo,
    advertisementList,
    specificAdsActivityDestinationList,
    specificAdsEssentialList,
    specificAdsMiningList,
    specificAdsRestaurantList,
    specificAdsRetailList,
    specificAdsTransportList,
    featuredAdvertisementList,
    showcaseAdvertisementList,
    destinationList,
    accommodationList,
    restaurantList,
    eventList,
    map,
    periodList,
    essentialServiceTypeList,
    miningServiceTypeList,
    retailServiceTypeList,
    transportServiceTypeList,
    specificAdsAccommodationList,
    specificAdsEventList,
    activityList,
    airport,
    displaySearchResultsBoolean,
    searchDocuments,
    showSearchResults,
    showSearchBarBoolean
}) {
    return {
        windowSize,
        adVideoList,
        adVideo,
        advertisementList,
        specificAdsActivityDestinationList,
        specificAdsEssentialList,
        specificAdsMiningList,
        specificAdsRestaurantList,
        specificAdsRetailList,
        specificAdsTransportList,
        featuredAdvertisementList,
        showcaseAdvertisementList,
        destinationList,
        accommodationList,
        restaurantList,
        eventList,
        map,
        periodList,
        essentialServiceTypeList,
        miningServiceTypeList,
        retailServiceTypeList,
        transportServiceTypeList,
        specificAdsAccommodationList,
        specificAdsEventList,
        activityList,
        airport,
        displaySearchResultsBoolean,
        searchDocuments,
        showSearchResults,
        showSearchBarBoolean
    };
}
export default connect(
    mapStateToProps,
    actions
)(App);
