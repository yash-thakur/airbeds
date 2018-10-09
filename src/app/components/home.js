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
  state = {
    data: [],
    value: undefined,
    guests: 2,
  }

  onChange(value) {
    this.setState({ guests: value });
  }

  handleSearch = () => {
    fetch("http://localhost:3030/search?q=test").then(res => res.json()).then(data => this.setState({ data: _.map(data, item => ({ text: item.race_name, value: item.race_name })) }));
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  }

  render() {
    const { data, value, guests } = this.state;
    return (
      <Layout>
        <Header>
          <div style={{ textAlign: "center" }}>
            <Select
              showSearch
              value={value}
              placeholder="Search by race e.g. Berlin Marathon"
              style={{ width: "400px" }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch}
              onChange={this.handleChange}
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
                        disabledDate={this.disabledDate}
                        format="YYYY-MM-DD"
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
                      <InputNumber min={1} max={5} defaultValue={guests} onChange={this.onChange} />
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
                      <Slider range defaultValue={[20, 50]} />
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
                      <Slider defaultValue={20} />
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
