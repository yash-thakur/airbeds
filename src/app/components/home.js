import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import {
  Select, Layout, DatePicker, InputNumber, Slider, Card, Icon, List, Pagination, Rate,
} from "antd";
import styles from "./home.less";

const {
  Header, Sider, Content,
} = Layout;
const { Meta } = Card;
const { RangePicker } = DatePicker;

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
    };
  }

  componentDidMount() {
    const url = "";
    fetch(url).then(res => console.log("Result: ", res)).catch(err => console.log("Error: ", err));
  }

  onChange(value, key) {
    this.setState({ [key]: value });
  }

  disabledDate = current => current && current < moment().endOf("day");

  handleSearch() {
    fetch("http://localhost:3030/search?q=test").then(res => res.json()).then(data => this.setState({ data: _.map(data, item => ({ text: item.race_name, value: item.race_name })) }));
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    const {
      data,
      searchData,
      value,
      dateRange,
      guests,
    } = this.state;

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
              onSearch={() => this.handleSearch()}
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
                      <Slider range defaultValue={[20, 50]} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div>Distance to Start:</div>
                    <div>
                      <Slider defaultValue={20} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Sider>
          <Content>
            <div>
              <List
                grid={{
                  gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 3,
                }}
                className={styles.results}
                dataSource={_.get(data, "results", [])}
                pagination={{ hideOnSinglePage: true, pageSize: 12 }}
                renderItem={(item) => {
                  let rating = _.toNumber(((item.rating) / 2).toFixed(1));
                  if (rating % parseInt(rating, 10) > 0.5) {
                    rating = parseInt(rating, 10) + 0.5;
                  } else {
                    rating = parseInt(rating, 10);
                  }

                  return (
                    <List.Item>
                      <a href={item.link} target="_blank" rel="noreferrer noopener nofollow">
                        <Card
                          hoverable
                          cover={<img alt="example" src={_.first(item.thumbnails)} style={{ height: "200px" }} />}
                        >
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
                        </Card>
                      </a>
                    </List.Item>
                  );
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
