import React, { Component } from 'react';
import { Button, Checkbox, Form, Select, Input, Message, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import ImageUploader from '../lib/uploading';
import { Eye, Mail, Triangle, User } from 'react-feather';
import { inProgress, notInProgress, addOutRequest } from '../redux/actions';
import { connect } from 'react-redux';

import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';

const FormItem = Form.Item;

const Content = styled.div`
	max-width: 400px;
	z-index: 2;
	min-width: 300px;
`;

class Signin extends Component {
	state = {
		picture: '',
		property: '',
		from: '',
		loading: false,
	};

	uploadRemove = (data) => {
		// console.log(data);
		this.setState({ picture: data.picture, loading: data.uploading });
	};

	handleChange = (e) => {
		let property = this.props.properties.properties.find((data) => data._id === e);
		this.setState({
			property: `${property.property} - ${property.location} by ${property.name}`,
			from: property.ownId,
		});
	};

	uploadResponse = (data) => {
		// console.log(data);
		this.setState({ picture: data.picture, loading: data.uploading });
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { form } = this.props;
		const Option = Select.Option;
		return (
			<Row
				type="flex"
				align="middle"
				justify="center"
				className="px-3 bg-white mh-page"
				style={{ minHeight: '100vh' }}
			>
				<Content>
					<div className="text-center mb-5">
						<Link href="/">
							<a className="brand mr-0">
								{/* <Triangle size={32} strokeWidth={1} /> */}
								<img src="/images/logo.png" alt="green facilities ltd" width="100%" />
							</a>
						</Link>
						<h5 className="mb-0 mt-3">Make a request</h5>
					</div>

					<Form
						layout="vertical"
						onSubmit={(e) => {
							e.preventDefault();
							form.validateFields((err, values) => {
								values.picture = this.state.picture;
								values.property = this.state.property;
								values.from = this.state.from;
								if (!err) {
									this.props.inProgress();
									Message.warning('Loading...').then(() =>
										this.props.addOutRequest(values, this.props.authentication.user),
									);
								}
							});
						}}
					>
						<FormItem label="Full Name">
							{getFieldDecorator('fullname', {
								rules: [
									{
										required: true,
										message: 'Please enter your name',
									},
								],
							})(<Input placeholder="Full Name" />)}
						</FormItem>
						<FormItem label="Email">
							{form.getFieldDecorator('email', {
								rules: [
									{
										type: 'email',
										message: 'The input is not valid E-mail!',
									},
									{
										required: true,
										message: 'Please input your E-mail!',
									},
								],
							})(
								<Input
									prefix={<Mail size={16} strokeWidth={1} style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="email"
									placeholder="Email"
								/>,
							)}
						</FormItem>
						<FormItem label="Phone Number">
							{getFieldDecorator('phone', {
								rules: [
									{
										required: true,
										message: 'Please enter your phone number',
									},
								],
							})(<Input type="phone" placeholder="Phone Number" />)}
						</FormItem>
						<FormItem label="Type">
							{getFieldDecorator('type', {
								rules: [
									{
										required: true,
										message: 'Please select a service type!',
									},
								],
							})(
								<Select style={{ width: '100%' }}>
									{this.props.services.services.map((service) => (
										<Option key={service._id} value={service.name}>
											{service.name}
										</Option>
									))}
								</Select>,
							)}
						</FormItem>
						<FormItem label={'Desciption'}>
							{getFieldDecorator('description', {
								rules: [
									{
										required: false,
										message: 'Please Describe the request in short sentence!',
										whitespace: true,
									},
								],
							})(
								<TextArea
									prefix={<User size={16} strokeWidth={1} style={{ color: 'rgba(0,0,0,.25)' }} />}
									// onChange={this.handleChange}
									placeholder="Request Description"
								/>,
							)}
						</FormItem>
						<FormItem label="Project Site">
							{getFieldDecorator('propertyId', {
								rules: [
									{
										required: true,
										message: 'Please select project site!',
									},
								],
							})(
								<Select style={{ width: '100%' }} onChange={this.handleChange}>
									{this.props.properties.propert.map((data) => (
										<Option key={data._id} value={data._id}>
											{data.property} - {data.location} by {data.name}
										</Option>
									))}
								</Select>,
							)}
						</FormItem>
						<FormItem label="Apartment">
							{getFieldDecorator('apartment', {
								rules: [
									{
										required: false,
										message: 'Please enter the apartment',
									},
								],
							})(<Input placeholder="Apartment" />)}
						</FormItem>
						<FormItem label="Picture">
							{getFieldDecorator('picture', {
								rules: [ { required: false, message: 'Please Upload your Profile Picture!' } ],
							})(<ImageUploader uploadResponse={this.uploadResponse} uploadRemove={this.uploadRemove} />)}
						</FormItem>

						<FormItem>
							<Button
								loading={this.props.ux.loading || this.state.loading ? true : false}
								type="primary"
								htmlType="submit"
								block
								className="mt-3"
							>
								Submit
							</Button>
						</FormItem>

						<div className="text-center">
							<small className="text-muted">
								<span>Do you have an account?</span>{' '}
								<Link href="/signup">
									<a>&nbsp;Go to sign in page!</a>
								</Link>
							</small>
						</div>
					</Form>
					<div
						className="mt-5 mb-2"
						style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '12px' }}
					>
						A product of green facilities limited
					</div>
				</Content>
			</Row>
		);
	}
}

export default connect((state) => state, { notInProgress, inProgress, addOutRequest })(Form.create()(Signin));
