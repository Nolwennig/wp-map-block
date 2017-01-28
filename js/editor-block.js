;( function( strings, blocks, $, _ ) {
	var OSM_API_BASE, OSM_FRAME_BASE, el;

	/**
	 * Base URL for OpenStreetMap query API.
	 *
	 * @type {String}
	 */
	OSM_API_BASE = 'https://nominatim.openstreetmap.org/search/';

	/**
	 * Base URL for OpenStreetMap embed frame.
	 *
	 * @type {String}
	 */
	OSM_FRAME_BASE = 'https://www.openstreetmap.org/export/embed.html';

	/**
	 * WordPress block element builder.
	 *
	 * @type {Function}
	 */
	el = blocks.element;

	/**
	 * Returns a map block form element.
	 *
	 * @param  {Object}          attributes Block attributes
	 * @param  {Object}          block      Block form state helpers
	 * @return {wp.blocks.Block}            Block form element
	 */
	function MapBlockForm( attributes, block ) {
		var onSubmit, className;

		onSubmit = function( event ) {
			var query, onError, onSuccess;

			event.preventDefault();

			// Find updated query from form
			query = $( '[name=query]', event.target ).val();

			// Set loading state with new query
			block.setAttributes( {
				query: query,
				isLoading: true
			} );

			/**
			 * Handles error request or empty data from query, setting state to
			 * indicate that query could not be found.
			 */
			onError = function() {
				block.setAttributes( {
					isLoading: false,
					isError: true
				} );
			};

			/**
			 * Handles successful query request, setting new bounding box for
			 * frame if result set is not empty.
			 *
			 * @param {Object[]} data Response from OpenStreetMap API
			 */
			onSuccess = function( data ) {
				if ( ! data.length ) {
					return onError();
				}

				block.setAttributes( {
					bbox: encodeURIComponent( data[ 0 ].boundingbox.join() ),
					isLoading: false
				} );
			};

			// Issue request to OpenStreetMap API to find bounding box by query
			$.getJSON( OSM_API_BASE + encodeURIComponent( query ) )
				.success( onSuccess )
				.error( onError );
		};

		className = _.compact( [
			'map-block-form',
			attributes.isLoading && 'is-loading',
			attributes.isError && 'is-error'
		] ).join( ' ' );

		return el( 'form', {
			className: className,
			onSubmit: onSubmit
		}, [
			MapBlockDisplay( attributes ),
			el( 'input', {
				type: 'text',
				name: 'query',
				value: attributes.query
			} ),
			el( 'button', null, [ 'Save' ] )
		] );
	}

	/**
	 * Returns a map block display element.
	 *
	 * @param  {Object}          attributes Block attributes
	 * @return {wp.blocks.Block}            Block form element
	 */
	function MapBlockDisplay( attributes ) {
		var isEmpty, className;

		isEmpty = ! attributes.bbox;

		className = _.compact( [
			'map-block',
			isEmpty && 'is-empty'
		] ).join( ' ' );

		if ( isEmpty ) {
			return el( 'div', {
				className: className
			}, [ strings.emptyPrompt ] );
		}

		return el( 'iframe', {
			className: className,
			width: 425,
			height: 350,
			frameBorder: 0,
			scrolling: 'no',
			src: OSM_FRAME_BASE + '?bbox=' + attributes.bbox
		} );
	}

	/**
	 * Checks to ensure whether block can be saved in its current state.
	 *
	 * @param {Object} attributes Block attributes
	 */
	function validateAttributes( attributes ) {
		if ( ! attributes.bbox ) {
			throw new Error( strings.emptyError );
		}
	}

	/**
	 * Given an object of form state attributes, returns an object containing
	 * only properties which should be encoded in block entity.
	 *
	 * @param  {Object} attributes Block form state attributes
	 * @return {Object}            Attributes to be encoded
	 */
	function encodeAttributes( attributes ) {
		return _.pick( attributes, 'bbox', 'query' );
	}

	blocks.register( 'map-block/map', {
		title: strings.title,
		description: strings.description,
		form: MapBlockForm,
		display: MapBlockDisplay,
		validateAttributes: validateAttributes,
		encodeAttributes: encodeAttributes
	} );
} )( this.mapBlockL10n, this.wp.blocks, this.jQuery, this._ );