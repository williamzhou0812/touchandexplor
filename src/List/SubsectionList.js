import React from "react";
import UpButton from "../Destination/icons/UpExploreButton.png";
import DownButton from "../Destination/icons/DownExploreButton.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
    SUBSECTION_LIST_ENTRIES,
    MediumOrange,
    shiftArray,
    HeavyBlue,
    HeavyOrange,
    LightOrange,
    getRandomImage,
    LightBlue,
    randomiseButKeepOrder,
    addNullItemToData
} from "../Constants";
import SidebarMapModel from "../Maps/SidebarMapModel";

class SubsectionList extends React.Component {
    constructor(props) {
        super(props);
        const { data, randomise } = this.props;

        this.state = {
            data: randomise ? randomiseButKeepOrder(data) : data
        };
        this.goUp = this.goUp.bind(this);
        this.goDown = this.goDown.bind(this);
    }
    goUp() {
        let items = this.state.data.slice();
        items = shiftArray(items, 1);
        this.setState({
            data: items
        });
    }
    goDown() {
        let items = this.state.data.slice();
        items = shiftArray(items, -1);
        this.setState({
            data: items
        });
    }
    styles = {
        horizontalVerticalCenter: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    };
    render() {
        const { data } = this.state;
        const {
            numberOfEntries,
            sideButtons,
            sideTitle,
            mainTitle,
            imageKey,
            isImageArray,
            namespace,
            renderText,
            useBackgroundImage,
            imgStyle,
            maps,
            advertiseWithUsOnlyOnce,
            fullBorderBottom,
            fullBorderBottomStyle
        } = this.props;
        const itemHeight = `${100 / numberOfEntries}%`;
        let toRender = data.slice();
        if (data.length < numberOfEntries) {
            toRender = addNullItemToData(data, numberOfEntries);
        }
        let hasRenderedAdvertiseWithUs = false;
        return (
            <div
                style={{ width: "100%", height: "100%", display: "flex" }}
                className="section--bottom--animation"
            >
                <div
                    style={{
                        backgroundColor: HeavyOrange,
                        width: "14%",
                        boxShadow: "9.899px 0px 7px 0px rgba(0,0,0,0.6)",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    {sideButtons.length > 0 &&
                        sideButtons.map((item, index) => {
                            if (item.isLink) {
                                return (
                                    <Link
                                        style={{
                                            flexBasis: "14%",
                                            textDecoration: "none"
                                        }}
                                        key={index}
                                        to={item.link}
                                    >
                                        <div
                                            style={{
                                                borderStyle:
                                                    "none none solid none",
                                                borderColor: LightOrange,
                                                paddingBottom: "38px"
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                style={{
                                                    width: "33%",
                                                    paddingTop: "33px"
                                                }}
                                                alt=""
                                            />
                                            <div
                                                style={{
                                                    color: "white",
                                                    fontSize: "16px"
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            } else if (item.isClick) {
                                return (
                                    <div
                                        style={{ flexBasis: "14%" }}
                                        key={index}
                                        onClick={item.onClick}
                                    >
                                        <div
                                            style={{
                                                borderStyle:
                                                    "none none solid none",
                                                borderColor: LightOrange,
                                                paddingBottom: "31px"
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                style={{
                                                    width: "33%",
                                                    paddingTop: "33px"
                                                }}
                                                alt=""
                                            />
                                            <div
                                                style={{
                                                    color: "white",
                                                    fontSize: "16px"
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else if (item.isMap) {
                                return (
                                    <SidebarMapModel
                                        item={item}
                                        mainTitle={mainTitle}
                                        maps={maps}
                                    />
                                );
                            } else {
                                return (
                                    <div
                                        style={{ flexBasis: "14%" }}
                                        key={index}
                                    >
                                        <div
                                            style={{
                                                borderStyle:
                                                    "none none solid none",
                                                borderColor: LightOrange,
                                                paddingBottom: "31px"
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                style={{
                                                    width: "33%",
                                                    paddingTop: "33px"
                                                }}
                                                alt=""
                                            />
                                            <div
                                                style={{
                                                    color: "white",
                                                    fontSize: "16px"
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            fontSize: "40pt",
                            fontWeight: 500,
                            letterSpacing: "10px"
                        }}
                    >
                        <span style={{ transform: "rotate(-90deg)" }}>
                            {sideTitle}
                        </span>
                    </div>
                </div>
                <div style={{ width: "86%" }}>
                    <div
                        style={{
                            height: "8%",
                            backgroundColor: LightOrange,
                            color: "white",
                            ...this.styles.horizontalVerticalCenter,
                            fontSize: "20pt",
                            letterSpacing: 5
                        }}
                    >
                        {mainTitle}
                    </div>
                    <div
                        style={{
                            height: "6%",
                            backgroundColor: MediumOrange,
                            ...this.styles.horizontalVerticalCenter
                        }}
                        onClick={this.goUp}
                    >
                        <img src={UpButton} style={{ width: "5%" }} alt="Up" />
                    </div>
                    <div style={{ height: "80%", overflow: "hidden" }}>
                        <div
                            style={{
                                height: "100%",
                                overflowY: "auto",
                                marginRight: "-30px"
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    overflow: "auto"
                                    //paddingRight: '30px'
                                }}
                            >
                                {toRender.map((item, index) => {
                                    let imageSrc = null;
                                    if (item) {
                                        imageSrc = isImageArray
                                            ? getRandomImage(item[imageKey])
                                            : item[imageKey];
                                    }
                                    const isLastItem =
                                        index === toRender.length - 1;
                                    if (item && namespace) {
                                        return (
                                            <Link
                                                style={{
                                                    height: itemHeight,
                                                    color: "white",
                                                    display: "flex",
                                                    textDecoration: "none",
                                                    borderBottom: fullBorderBottom
                                                        ? fullBorderBottomStyle
                                                        : "none"
                                                }}
                                                to={`${namespace}/${item.id}`}
                                                key={`${item.id}-${index}`}
                                            >
                                                {useBackgroundImage ? (
                                                    <div
                                                        style={{
                                                            width: "33%",
                                                            backgroundImage: `url(${imageSrc})`,
                                                            backgroundSize:
                                                                "cover",
                                                            backgroundPosition:
                                                                "center",
                                                            borderBottom:
                                                                isLastItem ||
                                                                fullBorderBottom
                                                                    ? "none"
                                                                    : `1px solid ${LightBlue}`
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "33%",
                                                            borderBottom:
                                                                isLastItem ||
                                                                fullBorderBottom
                                                                    ? "none"
                                                                    : `1px solid ${LightBlue}`,
                                                            backgroundColor: HeavyBlue,
                                                            ...this.styles
                                                                .horizontalVerticalCenter
                                                        }}
                                                    >
                                                        <img
                                                            src={imageSrc}
                                                            style={imgStyle}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        width: "67%",
                                                        backgroundColor: HeavyBlue,
                                                        display: "flex",
                                                        fontSize: "24px",
                                                        letterSpacing: "3px",
                                                        alignItems: "center",
                                                        paddingLeft: 35,
                                                        borderBottom:
                                                            isLastItem ||
                                                            fullBorderBottom
                                                                ? "none"
                                                                : "1px solid rgb(183,223,228)"
                                                    }}
                                                >
                                                    {renderText(item)}
                                                </div>
                                            </Link>
                                        );
                                    } else if (item) {
                                        return (
                                            <div
                                                style={{
                                                    height: itemHeight,
                                                    color: "white",
                                                    display: "flex"
                                                }}
                                                key={`${item.id}-${index}`}
                                            >
                                                {useBackgroundImage ? (
                                                    <div
                                                        style={{
                                                            width: "33%",
                                                            backgroundImage: `url(${imageSrc})`,
                                                            backgroundSize:
                                                                "cover",
                                                            backgroundPosition:
                                                                "center",
                                                            borderBottom:
                                                                isLastItem ||
                                                                fullBorderBottom
                                                                    ? "none"
                                                                    : `1px solid ${LightBlue}`
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "33%",
                                                            borderBottom:
                                                                isLastItem ||
                                                                fullBorderBottom
                                                                    ? "none"
                                                                    : `1px solid ${LightBlue}`,
                                                            backgroundColor: HeavyBlue,
                                                            ...this.styles
                                                                .horizontalVerticalCenter
                                                        }}
                                                    >
                                                        <img
                                                            src={imageSrc}
                                                            style={imgStyle}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        width: "67%",
                                                        backgroundColor: HeavyBlue,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: 35,
                                                        fontSize: "24px",
                                                        letterSpacing: "3px",
                                                        borderBottom:
                                                            isLastItem ||
                                                            fullBorderBottom
                                                                ? "none"
                                                                : "1px solid rgb(183,223,228)"
                                                    }}
                                                >
                                                    {renderText(item)}
                                                </div>
                                            </div>
                                        );
                                    } else if (
                                        (!Boolean(item) &&
                                            !hasRenderedAdvertiseWithUs) ||
                                        (!Boolean(item) &&
                                            !advertiseWithUsOnlyOnce)
                                    ) {
                                        //Advertise with us
                                        hasRenderedAdvertiseWithUs = true;
                                        return (
                                            <div
                                                style={{
                                                    height: itemHeight,
                                                    display: "flex"
                                                }}
                                                key={`null-${index}-render`}
                                            >
                                                <div
                                                    style={{
                                                        width: "33%",
                                                        borderBottom:
                                                            isLastItem ||
                                                            fullBorderBottom
                                                                ? "none"
                                                                : `1px solid ${LightBlue}`,
                                                        backgroundColor:
                                                            "white",
                                                        ...this.styles
                                                            .horizontalVerticalCenter,
                                                        color: "rgb(8,152,163)"
                                                    }}
                                                >
                                                    YOUR
                                                    <br />
                                                    LOGO
                                                    <br />
                                                    HERE
                                                </div>
                                                <div
                                                    style={{
                                                        width: "67%",
                                                        backgroundColor: HeavyBlue,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        paddingLeft: 35,
                                                        fontSize: "24px",
                                                        letterSpacing: "3px",
                                                        borderBottom:
                                                            isLastItem ||
                                                            fullBorderBottom
                                                                ? "none"
                                                                : "1px solid rgb(183,223,228)",
                                                        color: "white"
                                                    }}
                                                >
                                                    Advertise your business
                                                    here!
                                                    <br />
                                                    For more information,
                                                    contact:
                                                    <br />
                                                    touchscreen@jbg.com.pg
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                style={{
                                                    height: itemHeight,
                                                    display: "flex",
                                                    backgroundColor: HeavyBlue,
                                                    borderBottom:
                                                        isLastItem ||
                                                        fullBorderBottom
                                                            ? "none"
                                                            : "1px solid rgb(183,223,228)"
                                                }}
                                                key={`null-${index}`}
                                            >
                                                <div
                                                    style={{
                                                        width: "33%",
                                                        borderRight:
                                                            "1px solid rgb(183,223,228)"
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            height: "6%",
                            backgroundColor: MediumOrange,
                            ...this.styles.horizontalVerticalCenter
                        }}
                        onClick={this.goDown}
                    >
                        <img
                            src={DownButton}
                            style={{ width: "5%" }}
                            alt="Down"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
SubsectionList.defaultProps = {
    numberOfEntries: SUBSECTION_LIST_ENTRIES,
    sideButtons: [],
    renderText: item => item.title.toUpperCase(),
    useBackgroundImage: true,
    randomise: true,
    advertiseWithUsOnlyOnce: true,
    fullBorderBottom: false,
    fullBorderBottomStyle: "1px solid rgb(183,223,228)"
};

SubsectionList.propTypes = {
    numberOfEntries: PropTypes.number,
    data: PropTypes.array.isRequired,
    imageKey: PropTypes.string.isRequired,
    isImageArray: PropTypes.bool.isRequired,
    sideButtons: PropTypes.array,
    sideTitle: PropTypes.string.isRequired,
    mainTitle: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    renderText: PropTypes.func,
    useBackgroundImage: PropTypes.bool,
    imgStyle: PropTypes.object,
    randomise: PropTypes.bool,
    advertiseWithUsOnlyOnce: PropTypes.bool,
    fullBorderBottom: PropTypes.bool,
    fullBorderBottomStyle: PropTypes.string
};

export default SubsectionList;
