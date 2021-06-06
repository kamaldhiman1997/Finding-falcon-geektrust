import { useEffect, useRef, useState } from 'react';

function Dropdown({
	items = [],
	onChangeHandler = () => {},
	parentKey = 0,
	intialValue = 'Select Option',
	currentValue = { name: '' },
	...props
}) {
	/**
	 * Reference of Elements
	 */
	const inputField = useRef(null);
	const listContainer = useRef(null);

	let data = [...items];

	useEffect(() => {
		setCValue(currentValue);
	}, [currentValue]);

	///Local States
	const [cValue, setCValue] = useState({ ...currentValue });
	const [state, setState] = useState({
		isOpen: false,
		list: [],
		is_focus: -1,
	});

	const getItemValue = (item) => item.name;

	const filterList = (value = '') => {
		let list = [];
		if (value && value.trim()) {
			list = data.filter((d) => getItemValue(d).toLowerCase().indexOf(value.trim().toLowerCase()) > -1);
		}
		return list;
	};

	/**
	 * Close List On Blur
	 */
	const handleInputBlur = () => {
		setTimeout(() => {
			setState({
				list: [],
				isOpen: false,
			});
		}, 200);
	};

	/**
	 *
	 * @param {*} e |Event
	 */
	const handleInputChange = (e) => {
		const { target } = e;
		const { value } = target;
		let cloneValue = { ...cValue };
		cloneValue.name = value;
		setCValue(cloneValue);
		const list = filterList(value);
		setState({
			list: list,
			isOpen: list.length > 0,
			is_focus: 0,
		});
	};

	/**
	 * Set List on Input focus
	 */
	const handleInputFocus = () => {
		const list = filterList(cValue.name);
		setState({
			list: list,
			is_focus: 0,
			isOpen: list.length > 0,
		});
	};

	/**
	 *
	 * @param {*} e
	 */
	const handleInputKeyUp = (e) => {
		const { is_focus, list } = state;
		const { keyCode } = e;
		let cloneState = { ...state };

		e.stopPropagation();
		e.preventDefault();
		if (keyCode === 13) {
			// Enter
			onEnter();
		} else if (keyCode === 38) {
			// Up
			if (is_focus > 0) {
				cloneState.is_focus--;
				cloneState['move'] = 'up';
				setState(cloneState);
			}
		} else if (keyCode === 39) {
			// Right
			onEnter(e);
		} else if (keyCode === 40) {
			// Down
			if (is_focus < list.length - 1) {
				cloneState.is_focus++;
				cloneState['move'] = 'down';
				setState(cloneState);
			}
		}
	};

	/**
	 * Handle on Enter click
	 */
	const onEnter = () => {
		const { is_focus, list } = state;
		const data = list[is_focus];
		if (data) {
			setCValue(data);
			onChangeHandler(data, parentKey);
		}
		setState({
			list: [],
			isOpen: false,
		});
	};

	const renderMenu = () => {
		const { is_focus } = state;
		const menus = state.list.map((data, i) => {
			return (
				<div
					role="button"
					tabIndex="-1"
					key={i}
					className={i === is_focus ? 'is_focus' : ''}
					onClick={() => {
						setCValue(data);
						onChangeHandler(data, parentKey);
					}}
				>
					{data.name}
				</div>
			);
		});
		setTimeout(() => {
			scrollListContainer();
		}, 10);

		return menus;
	};

	const scrollListContainer = () => {
		const { is_focus, move } = state;
		const c = listContainer.current;

		if (c) {
			if (c.children[0]) {
				const nh = c.offsetHeight;
				const ch = c.children[0].offsetHeight;
				const st = c.scrollTop;

				if (move === 'down') {
					const moveBottom = (is_focus + 1) * ch;

					if (moveBottom - st > nh) {
						c.scrollTo(0, moveBottom - nh);
					}
				} else if (move === 'up') {
					const moveTop = is_focus * ch;

					if (moveTop < st) {
						c.scrollTo(0, moveTop);
					}
				}
			}
		}
	};

	return (
		<div className="drop-down">
			<div className={`autocomplete-field`}>
				<div className="input-field">
					<input
						type="text"
						autoComplete="off"
						placeholder="Select Location"
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						onChange={handleInputChange}
						onKeyUp={handleInputKeyUp}
						value={cValue.name}
						ref={inputField}
					/>
				</div>
				<div className={`autocomplete-list ${state.isOpen ? 'show' : ''}`} ref={listContainer}>
					{renderMenu()}
				</div>
				<style>{`
          .autocomplete-field {
            position: relative;
          }
          .autocomplete-field .input-field {
            position: relative;
            width: 100%;
          }
          .autocomplete-field input[type="text"] {
            width: 100%;
          }
          .autocomplete-field.has-icon input[type="text"] {
            padding-right: 40px;
          }
          .autocomplete-field .autocomplete-list {
            position: absolute;
            top: 2em;
            width: 100%;
            background: white;
            overflow: auto;
            height: 0;
            z-index: 9;
            -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
          }
          .autocomplete-field .autocomplete-list.show {
            border: 1px solid #d2d6de;
            border-top: none;
            height: unset;
            max-height: 214px;
          }
          .autocomplete-field .autocomplete-list > div {
            padding: 6px 12px;
            background: white;
            border-bottom: 1px solid #d2d6de;
            cursor: pointer;
            outline: none;
          }
          .autocomplete-field .autocomplete-list > div:hover {
            background: rgba(0, 0, 0, 0.1);
          }
          .autocomplete-field .autocomplete-list > div:last-child {
            border: none;
          }
          .autocomplete-field .autocomplete-list > div.is_focus {
            background: rgba(0, 0, 0, 0.2);
          }
          .autocomplete-field .icon-search {
            position: absolute;
            right: 0;
            top: 50%;
            height: 32px;
            width: 32px;
            -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
            cursor: pointer;
            font-size: 1.3em;
            padding: .2em;
            text-align: center;
            outline: none;
          }
        `}</style>
			</div>
		</div>
	);
}

export default Dropdown;
