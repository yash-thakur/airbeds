import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import {
  Select, Layout, DatePicker, InputNumber, Slider, Card, Icon, List, Rate, Spin, Carousel,
} from "antd";
import styles from "./home.less";

const {
  Header, Sider, Content,
} = Layout;
const { Meta } = Card;
const { RangePicker } = DatePicker;

const antIconLoader = <Icon type="loading" style={{ fontSize: 38 }} spin />;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: _.get(this.props, "loadedData", {}),
      searchData: [],
      value: undefined,
      dateRange: [
        moment().endOf("day"),
        moment().add(1, "day").endOf("day"),
      ],
      guests: 2,
      lat: 52.514050,
      lng: 13.344720,
      radius: 10000,
      priceRange: [
        10,
        2000,
      ],
      resultsLoading: false,
    };
  }

  onChange(value, key) {
    const {
      guests,
      dateRange,
      lat,
      lng,
      radius,
      priceRange,
    } = this.state;
    this.setState({
      [key]: value,
    });
    const params = {
      guests,
      lat,
      lng,
      dateRange,
      radius,
      priceRange,
    };
    _.assignIn(params, { [key]: value });
    this.updateResults(params);
  }

  disabledDate = current => current && current < moment().endOf("day");

  // handleSearch() {
  //   fetch("http://localhost:3030/search?q=test").then(res => res.json()).then(data => this.setState({ data: _.map(data, item => ({ text: item.race_name, value: item.race_name })) }));
  // }

  handleChange(value) {
    this.setState({ value });
  }

  updateResults(params) {
    const { resultsLoading } = this.state;
    if (resultsLoading) return;
    this.setState({ resultsLoading: true });
    const url = `https://api.stay22.com/v2/hotelscombined?latitude=${params.lat}&longitude=${params.lng}&language=en&currency=USD&guests=${params.guests}&checkin=${_.first(params.dateRange).unix()}&checkout=${_.last(params.dateRange).unix()}&radius=${params.radius}&minprice=${_.first(params.priceRange)}&maxprice=${_.last(params.priceRange)}`;
    fetch(url).then(res => res.json()).then((res) => {
      this.setState({
        data: res,
        resultsLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState({
        resultsLoading: false,
      });
    });
  }

  render() {
    const {
      data,
      searchData,
      value,
      dateRange,
      guests,
      resultsLoading,
    } = this.state;

    const marks = {
      1000: "1000 m",
      20000: "20000 m",
    };

    return (
      <Layout>
        <Header className={styles.header}>
          <div className={styles.banner}>
            <h1 className={styles["h1-style"]}>
              Book accomodation closest to the start of running races.
            </h1>
            <Select
              showSearch
              value={value}
              placeholder="Search by race e.g. Berlin Marathon"
              className={styles["search-bar"]}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              // onSearch={() => this.handleSearch()}
              onChange={val => this.handleChange(val, "value")}
              notFoundContent={null}
              suffixIcon={<Icon type="search" theme="twoTone" twoToneColor="#52c41a" />}
            >
              {_.map(
                searchData, d => (
                  <Select.Option key={d.value} value={d.value}>{d.text}</Select.Option>),
              )}
            </Select>
          </div>
        </Header>
        <Layout className={styles["body-layout"]}>
          <Sider className={styles.sidebar} width={300}>
            <table>
              <tbody>
                <tr>
                  <td className={styles["d-block"]}>
                    <div>When:</div>
                    <div>
                      <RangePicker
                        disabledDate={current => this.disabledDate(current)}
                        format="YYYY-MM-DD"
                        onChange={val => this.onChange(val, "dateRange")}
                        value={dateRange}
                      />
                    </div>
                  </td>
                  <td className={styles["d-block"]}>
                    <div>Guests:</div>
                    <div>
                      <InputNumber min={1} max={5} defaultValue={guests} onChange={val => this.onChange(val, "guests")} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div>Price Range:</div>
                    <div>
                      <Slider
                        min={10}
                        max={2000}
                        step={10}
                        tooltipVisible
                        range
                        defaultValue={[10, 2000]}
                        onAfterChange={val => this.onChange(val, "priceRange")}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div>Distance to Start:</div>
                    <div>
                      <Slider
                        marks={marks}
                        min={1000}
                        max={20000}
                        step={500}
                        tooltipVisible
                        defaultValue={10000}
                        onAfterChange={val => this.onChange(val, "radius")}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Sider>
          <Content>
            {
              (resultsLoading)
              && (
                <div className={styles.loader}>
                  <Spin size="large" tip="Loading..." indicator={antIconLoader} />
                </div>
              )
            }
            {
              (!resultsLoading)
              && (
                <div>
                  <List
                    grid={{
                      gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 3,
                    }}
                    className={styles.results}
                    dataSource={_.get(data, "results", [])}
                    pagination={{ hideOnSinglePage: true, pageSize: 12, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }}
                    renderItem={item => (
                      <List.Item>
                        <Card
                          hoverable
                          cover={
                            (
                              <Carousel dots draggable className={styles.slide}>
                                {
                                  _.map(_.get(item, "thumbnails", []), (img, key) => (<img alt="hotel_img" key={key} src={img} style={{ height: "200px" }} />))
                                }
                              </Carousel>)
                          }
                        >
                          <a href={item.link} target="_blank" rel="noreferrer noopener nofollow">
                            <Meta
                              title={item.name}
                            />
                            <Rate value={item.num_stars} />
                            Hotel
                            <br />
                            Rating:&nbsp;
                            { _.get(item, "rating", 0) }
                            /10
                            <br />
                            Reviews:&nbsp;
                            { _.get(item, "review_count", 0) }
                          </a>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              )
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}
