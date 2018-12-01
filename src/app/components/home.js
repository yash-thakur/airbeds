import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import {
  Select, Layout, DatePicker, InputNumber, Slider, Card, Icon,
} from "antd";

const {
  Header, Sider, Content,
} = Layout;

const { RangePicker } = DatePicker;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: undefined,
      guests: 2,
    };
  }

  componentDidMount() {
    fetch("/api/getdata", {
      method: "GET",
    }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));
  }

  onChange(value) {
    this.setState({ guests: value });
  }

  disabledDate = current => current && current < moment().endOf("day");

  handleSearch() {
    fetch("http://localhost:3030/search?q=test").then(res => res.json()).then(data => this.setState({ data: _.map(data, item => ({ text: item.race_name, value: item.race_name })) }));
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    const { data, value, guests } = this.state;
    return (
      <Layout>
        <Header style={{ height: "auto" }}>
          <div style={{ textAlign: "center", padding: "90px 90px 20px 90px" }}>
            <h1 style={{ fontSize: "52px", color: "#fff" }}>
              Book accomodation closest to the start of running races.
            </h1>
            <Select
              showSearch
              value={value}
              placeholder="Search by race e.g. Berlin Marathon"
              style={{ width: "400px" }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={() => this.handleSearch()}
              onChange={val => this.handleChange(val)}
              notFoundContent={null}
              suffixIcon={<Icon type="search" theme="twoTone" twoToneColor="#52c41a" />}
            >
              {_.map(
                data, d => (
                  <Select.Option key={d.value} value={d.value}>{d.text}</Select.Option>),
              )}
            </Select>
          </div>
        </Header>
        <Layout>
          <Sider style={{ height: "100vh" }}>
            <Card style={{ width: 300, height: "100%" }}>
              <table>
                <tbody>
                  <tr><td>When:</td></tr>
                  <tr>
                    <td>
                      <RangePicker
                        disabledDate={current => this.disabledDate(current)}
                        format="YYYY-MM-DD"
                        onChange={val => this.onChange(val)}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td>
                      Guests:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <InputNumber
                        min={1}
                        max={5}
                        value={guests}
                        onChange={val => this.onChange(val)}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td>
                      Price Range:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Slider
                        range
                        defaultValue={[20, 50]}
                        onChange={val => this.onChange(val)}
                      />
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td>
                      Distance to Start:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Slider
                        defaultValue={20}
                        onChange={val => this.onChange(val)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Sider>
          <Content>Content</Content>
        </Layout>
      </Layout>
    );
  }
}
