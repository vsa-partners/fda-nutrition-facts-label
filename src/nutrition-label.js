require('./nutrition-label.scss');

;(function ($, window, document, undefined) {
	var pluginName = "fdaNutritionLabel",
		defaults = {
			data: {
				servings_per_container : {
					value: 1
				},
			  serving_size : {
					value: ''
				},
			  calories : {
					value: 1
				},
			  total_fat : {
					value: false,
					title: 'Total Fat',
					measurement: 'g',
					isBold: true,
					rdi: 78
				},
				saturated_fat : {
					value: false,
					title: 'Saturated Fat',
					measurement: 'g',
					rdi: 20,
					addClass: ['indent']
				},
				trans_fat : {
					value: false,
					title: 'Trans Fat',
					measurement: 'g',
					addClass: ['indent']
				},
			  cholesterol : {
					value: false,
					title: 'Cholesterol',
					measurement: 'mg',
					isBold: true,
					rdi: 300
				},
			  sodium : {
					value: false,
					title: 'Sodium',
					measurement: 'mg',
					isBold: true,
					rdi: 2300
				},
			  total_carbs : {
					value: false,
					title: 'Total Carbohydrates',
					measurement: 'mg',
					isBold: true,
					rdi: 275
				},
				dietary_fiber : {
					value: false,
					title: 'Dietary Fiber',
					measurement: 'g',
					rdi: 28,
					addClass: ['indent']
				},
				total_sugars : {
					value: false,
					title: 'Total Sugars',
					measurement: 'g',
					addClass: ['indent']
				},
			  added_sugars : {
					value: false,
					title: 'Includes',
					measurement: 'g Added Sugars',
					rdi: 50,
					addClass: ['indent-2']
				},
			  protein : {
					value: false,
					title: 'Protein',
					measurement: 'g',
					isBold: true
				},
			  vitamin_a : {
					value: false,
					title: 'Vitamin A',
					measurement: 'mcg',
					rdi: 900,
				},
			  vitamin_c : {
					value: false,
					title: 'Vitamin C',
					measurement: 'mg',
					rdi: 90,
				},
			  vitamin_d : {
					value: false,
					title: 'Vitamin D',
					measurement: 'mcg',
					rdi: 20,
				},
			  calcium : {
					value: false,
					title: 'Calcium',
					measurement: 'mg',
					rdi: 1300,
				},
			  iron : {
					value: false,
					title: 'Iron',
					measurement: 'mg',
					rdi: 18,
				},
			  potassium : {
					value: false,
					title: 'Potassium',
					measurement: 'mg',
					rdi: 4700,
				},
				calories_per_gram: {
					fat: {
						value: false,
						title: 'Fat'
					},
					carbs: {
						value: false,
						title: 'Carbohydrate'
					},
					protein: {
						value: false,
						title: 'Protein'
					}
				}
			},
			disclaimer: 'The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.',
			primaryClass: 'fda-nutrition-label'
		};

	function Plugin(element, options) {
		let _ = this;

		_.element = element;
		_.$elem = $(element);
		_.options = $.extend(true, {}, defaults, options) ;

		_._defaults = defaults;
		_._name = pluginName;

		_.init();
	}

	Plugin.prototype = {
		init: function() {
			let _ = this,
				cl = _.options.primaryClass;

			_.$elem.addClass(cl);
			_.sections = ['title', 'servings', 'calories', 'daily-value-a', 'daily-value-b', 'disclaimer'].map((item) => {
				return {
					name: item,
					$el: $(`<div class="${[cl+'--section', item].join(' ')}" />`).appendTo(_.$elem)
				}
			});
			_.render();
		},

		buildRow: function(item, boldDv = false) {
			let classes = item.addClass || [],
				measurement = item.measurement || '',
				dv = item.rdi ? Math.round(item.value/item.rdi*100) + '%' : '';

			if (item.percent)
				dv = item.percent + '%';

			return $(`
				<div class="${this.options.primaryClass}--row ${classes.join(' ')}">
					<div>${item.isBold ? '<b>'+item.title+'</b>' : item.title} ${item.value + measurement}</div>
					<div>${boldDv ? '<b>'+dv+'</b>' : dv}</div>
				</div>
			`);
		},

		appendToSection: function(el, section) {
			let _sec = this.sections.find((item) => item.name === section);
			if (_sec) {
				if (Array.isArray(el)) {
					el.forEach((item) => {
						item.appendTo(_sec.$el);
					});
				} else {
					el.appendTo(_sec.$el);
				}
			} else {
				console.error(`${section} does not exist.`)
			}
		},

		render: function() {
			let _ = this;
			let opts = _.options;
			let data = opts.data;

			_.appendToSection($('<b>Nutrition Facts</b>'), 'title');

			_.appendToSection($(`
				<span>${data.servings_per_container.value} servings per container</span>
				<div class="${opts.primaryClass}--row">
					<div><b>Serving size</b></div>
					<div><b>${data.serving_size.value}</b></div>
				</div>
			`), 'servings');

			_.appendToSection($(`
				<div><b>Amount per serving</b></div>
				<div class="${opts.primaryClass}--row">
					<div><b>Calories</b></div>
					<div><b>${data.calories.value}</b></div>
				</div>
			`), 'calories');

			_.appendToSection($(`
				<div class="${opts.primaryClass}--row">
					<div/>
					<div><b>% Daily Value*</b></div>
				</div>
			`), 'daily-value-a');

			_.appendToSection([
				data.total_fat,
				data.saturated_fat,
				data.trans_fat,
				data.cholesterol,
				data.sodium,
				data.total_carbs,
				data.dietary_fiber,
				data.total_sugars,
				data.added_sugars,
				data.protein
			].filter((item) => {
				return item.value !== false;
			}).map((item) => _.buildRow(item, true)), 'daily-value-a');

			_.appendToSection([
				data.vitamin_d,
				data.calcium,
				data.iron,
				data.potassium,
				data.vitamin_a,
				data.vitamin_c,
			].filter((item) => {
				return item.value !== false;
			}).map((item) => _.buildRow(item)), 'daily-value-b');

			_.appendToSection($(`<span>${opts.disclaimer}</span>`), 'disclaimer');

			let cpg = [
				data.calories_per_gram.fat,
				data.calories_per_gram.carbs,
				data.calories_per_gram.protein
			];

			if (cpg.every(item => item.value !== false)) {
				_.appendToSection($(`
					<div class="calories-per-gram">
						Calories per gram:
						<span>
							<ul>
								${cpg.map(item => `<li>${item.title} ${item.value}</li>`).join('')}
							</ul>
						</span>
					</div>
				`), 'disclaimer');
			}
		}
	};

	$.fn[pluginName] = function (options) {
		let _ = this;

		return _.each(function () {
			if (!$.data(_, "plugin_" + pluginName)) {
				$.data(_, "plugin_" + pluginName,
				new Plugin(_, options));
			}
		});
	};

})(jQuery, window, document);
